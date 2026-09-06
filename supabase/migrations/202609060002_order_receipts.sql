begin;
alter table public.orders add column request_token uuid unique;
alter table public.orders add column expires_at timestamptz;
alter table public.orders add column discount_id text;
alter table public.orders add column discount_amount integer not null default 0;
alter table public.orders add column receipt jsonb;
create index orders_reservation_expiry on public.orders(expires_at) where status='new';
create index orders_phone_created on public.orders(phone,created_at);

-- A caller may only release reservations whose deadline has already passed.
create function public.expire_store_reservations() returns void
language plpgsql security definer set search_path = '' as $$
declare reservation record; item record; current_stock jsonb; variant text;
begin
  for reservation in select id from public.orders
    where status='new' and expires_at <= now() for update skip locked loop
    for item in select * from public.order_items where order_id=reservation.id loop
      select value into current_stock from public.store_settings where key=item.inventory_key for update;
      if item.inventory_key like 'product_variant_stock:%' then
        variant := item.color || '::' || item.size;
        update public.store_settings set value=jsonb_set(coalesce(current_stock,'{}'),array[variant],
          to_jsonb(coalesce((current_stock->>variant)::integer,0)+item.quantity)),updated_at=now()
          where key=item.inventory_key;
      else
        update public.store_settings set value=to_jsonb(coalesce((current_stock #>> '{}')::integer,0)+item.quantity),updated_at=now()
          where key=item.inventory_key;
      end if;
    end loop;
    update public.orders set status='cancelled',updated_at=now() where id=reservation.id;
  end loop;
end $$;

create function public.create_store_order_v2(customer jsonb, items jsonb, request_token uuid, coupon text default '')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare existing public.orders%rowtype; new_id uuid; result jsonb; rules jsonb;
  rule jsonb; eligible integer; reduction integer; best integer := 0; chosen text;
  original_total integer; used integer;
begin
  if request_token is null then raise exception 'INVALID_REQUEST'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(request_token::text,0));
  perform public.expire_store_reservations();
  select * into existing from public.orders o where o.request_token=create_store_order_v2.request_token;
  if found then
    if existing.status='cancelled' then raise exception 'RESERVATION_EXPIRED'; end if;
    return existing.receipt;
  end if;
  if exists(select 1 from public.store_settings where key='orders_enabled' and value #>> '{}' = 'false') then
    raise exception 'ORDERS_PAUSED';
  end if;
  if length(coalesce(customer->>'name','')) > 150 or length(coalesce(customer->>'city','')) > 1000
    or length(coalesce(customer->>'comment','')) > 2000
    or coalesce(customer->>'phone','') !~ '^[+0-9 ()-]{7,30}$' then raise exception 'INVALID_CUSTOMER'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(regexp_replace(customer->>'phone','[^0-9]','','g'),1));
  if (select count(*) from public.orders where regexp_replace(phone,'[^0-9]','','g')=regexp_replace(customer->>'phone','[^0-9]','','g') and created_at>now()-interval '1 hour') >= 5 then
    raise exception 'TOO_MANY_ORDERS';
  end if;
  if jsonb_typeof(items) is distinct from 'array' then raise exception 'INVALID_ITEMS'; end if;
  if exists(select 1 from jsonb_array_elements(items) i where
    coalesce(i->>'quantity','') !~ '^[1-9][0-9]?$' or i->>'color' is null or i->>'size' is null) then
    raise exception 'INVALID_ITEMS';
  end if;
  if exists(select 1 from jsonb_array_elements(items) i
    join public.products p on p.id=(i->>'product_id')::uuid
    join public.categories c on c.slug=p.category_slug where not c.active) then
    raise exception 'Product is unavailable';
  end if;
  -- Serialize coupon usage checks before stock locks to avoid double redemption.
  select value into rules from public.store_settings where key='discount_rules' for update;
  new_id := public.create_store_order(customer,items);
  select total into original_total from public.orders where id=new_id;
  for rule in select * from jsonb_array_elements(coalesce(rules,'[]'::jsonb)) loop
    if coalesce((rule->>'active')::boolean,false)=false then continue; end if;
    if coupon <> '' then
      if upper(trim(rule->>'code')) <> upper(trim(coupon)) then continue; end if;
    elsif not coalesce((rule->>'automatic')::boolean,false) then continue;
    end if;
    if nullif(rule->>'expiresAt','') is not null and (rule->>'expiresAt')::date < current_date then continue; end if;
    if original_total < coalesce((rule->>'minimum')::integer,0) then continue; end if;
    select count(*) into used from public.orders where discount_id=rule->>'id' and status<>'cancelled';
    if used >= coalesce((rule->>'usageLimit')::integer,100) then continue; end if;
    select coalesce(sum(oi.unit_price*oi.quantity),0) into eligible from public.order_items oi
      join public.products p on p.id=oi.product_id where oi.order_id=new_id and
      (rule->>'target'='all' or rule->>'target'=p.id::text or rule->>'target'=p.slug or exists(
        select 1 from public.collection_products cp join public.collections c on c.id=cp.collection_id
        where cp.product_id=p.id and (c.slug=rule->>'target' or c.id::text=rule->>'target')));
    reduction := 0;
    if rule->>'type'='percent' then reduction := floor(eligible * least(100,greatest(0,(rule->>'value')::numeric))/100);
    elsif rule->>'type'='fixed' then reduction := least(eligible,greatest(0,(rule->>'value')::integer));
    elsif rule->>'type'='bogo' then
      -- One free identical variant for each pair; never mixes unrelated products.
      select coalesce(sum(free_units*unit_price),0) into reduction from (
        select floor(sum(oi.quantity)/2.0) free_units,oi.unit_price from public.order_items oi
        join public.products p on p.id=oi.product_id where oi.order_id=new_id and
        (rule->>'target'='all' or rule->>'target'=p.id::text or rule->>'target'=p.slug or exists(
          select 1 from public.collection_products cp join public.collections c on c.id=cp.collection_id
          where cp.product_id=p.id and (c.slug=rule->>'target' or c.id::text=rule->>'target')))
        group by oi.product_id,oi.color,oi.size,oi.unit_price
      ) paired;
    end if;
    if reduction>best then best:=reduction; chosen:=rule->>'id'; end if;
  end loop;
  if coupon <> '' and chosen is null then raise exception 'COUPON_INVALID'; end if;
  -- Freeze the charged price, customer details and variant image in the receipt.
  update public.order_items oi set image=coalesce((s.value->oi.color->>0),oi.image)
    from public.store_settings s where oi.order_id=new_id and s.key='product_color_images:'||oi.product_id::text;
  update public.orders set request_token=create_store_order_v2.request_token,
    expires_at=now()+interval '24 hours',discount_id=chosen,discount_amount=best,total=original_total-best where id=new_id;
  select jsonb_build_object('id',o.id,'reference','SPX-'||lpad(o.order_number::text,greatest(4,length(o.order_number::text)),'0'),
    'total',o.total,'discount',o.discount_amount,'expiresAt',o.expires_at,'customer',customer,
    'lines',(select jsonb_agg(jsonb_build_object('productId',i.product_id,'name',i.product_name,'image',i.image,
      'color',i.color,'size',i.size,'quantity',i.quantity,'unitPrice',i.unit_price) order by i.id)
      from public.order_items i where i.order_id=o.id)) into result from public.orders o where o.id=new_id;
  update public.orders set receipt=result where id=new_id;
  return result;
end $$;
revoke execute on function public.create_store_order(jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.create_store_order_v2(jsonb,jsonb,uuid,text) from public;
grant execute on function public.create_store_order_v2(jsonb,jsonb,uuid,text) to anon,authenticated;
revoke all on function public.expire_store_reservations() from public;
grant execute on function public.expire_store_reservations() to anon,authenticated;
commit;

-- Schedule once after enabling pg_cron in Supabase (see deployment checklist):
-- select cron.schedule('sphinx-expire-reservations','*/5 * * * *','select public.expire_store_reservations()');
