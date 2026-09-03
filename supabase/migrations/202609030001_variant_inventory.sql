-- Atomic inventory reservations by color and size, plus safe restoration on cancellation.
alter table public.order_items add column if not exists inventory_key text;

create or replace function public.create_store_order(customer jsonb, items jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  new_order_id uuid;
  calculated_total integer := 0;
  item jsonb;
  product_row public.products%rowtype;
  requested_quantity integer;
  variant_key text;
  stock_key text;
  stock_value jsonb;
  available integer;
begin
  if coalesce(trim(customer->>'name'),'') = ''
    or coalesce(trim(customer->>'phone'),'') = ''
    or coalesce(trim(customer->>'city'),'') = '' then
    raise exception 'Required customer fields are missing';
  end if;
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 or jsonb_array_length(items) > 30 then
    raise exception 'Invalid order items';
  end if;

  insert into public.orders(customer_name,phone,telegram,city,comment,total)
  values(trim(customer->>'name'),trim(customer->>'phone'),nullif(trim(customer->>'telegram'),''),trim(customer->>'city'),nullif(trim(customer->>'comment'),''),0)
  returning id into new_order_id;

  for item in select * from jsonb_array_elements(items) loop
    requested_quantity := greatest(1, least(99, (item->>'quantity')::integer));
    select * into product_row from public.products
      where id=(item->>'product_id')::uuid and in_stock=true for update;
    if not found then raise exception 'Product is unavailable'; end if;
    if not (item->>'color' = any(product_row.colors)) or not (item->>'size' = any(product_row.sizes)) then
      raise exception 'Invalid product variant';
    end if;

    variant_key := left(item->>'color',50) || '::' || left(item->>'size',10);
    stock_key := 'product_variant_stock:' || product_row.id::text;
    select value into stock_value from public.store_settings where key=stock_key for update;
    if found then
      available := coalesce((stock_value->>variant_key)::integer,0);
      if available < requested_quantity then raise exception 'Insufficient stock for %', variant_key; end if;
      update public.store_settings
        set value=jsonb_set(value,array[variant_key],to_jsonb(available-requested_quantity),true),updated_at=now()
        where key=stock_key;
    else
      stock_key := 'product_stock:' || product_row.id::text;
      select value into stock_value from public.store_settings where key=stock_key for update;
      available := coalesce((stock_value #>> '{}')::integer,20);
      if available < requested_quantity then raise exception 'Insufficient product stock'; end if;
      insert into public.store_settings(key,value) values(stock_key,to_jsonb(available-requested_quantity))
        on conflict(key) do update set value=excluded.value,updated_at=now();
    end if;

    calculated_total := calculated_total + product_row.price * requested_quantity;
    insert into public.order_items(order_id,product_id,product_name,image,color,size,quantity,unit_price,inventory_key)
    values(new_order_id,product_row.id,product_row.name,coalesce(product_row.images[1],''),left(item->>'color',50),left(item->>'size',10),requested_quantity,product_row.price,stock_key);
  end loop;
  update public.orders set total=calculated_total where id=new_order_id;
  return new_order_id;
end $$;

create or replace function public.update_store_order_status(p_order_id uuid, next_status text)
returns void language plpgsql security definer set search_path = '' as $$
declare current_status text; item public.order_items%rowtype; stock_value jsonb; variant_key text; available integer;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if next_status not in ('new','contacted','confirmed','shipped','completed','cancelled') then
    raise exception 'Invalid order status';
  end if;
  select status into current_status from public.orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if current_status='cancelled' and next_status<>'cancelled' then
    raise exception 'Cancelled orders cannot be reopened';
  end if;
  if next_status='cancelled' and current_status<>'cancelled' then
    for item in select * from public.order_items where order_items.order_id=p_order_id loop
      select value into stock_value from public.store_settings where key=item.inventory_key for update;
      if item.inventory_key like 'product_variant_stock:%' then
        variant_key := item.color || '::' || item.size;
        available := coalesce((stock_value->>variant_key)::integer,0);
        update public.store_settings set value=jsonb_set(value,array[variant_key],to_jsonb(available+item.quantity),true),updated_at=now() where key=item.inventory_key;
      else
        available := coalesce((stock_value #>> '{}')::integer,0);
        update public.store_settings set value=to_jsonb(available+item.quantity),updated_at=now() where key=item.inventory_key;
      end if;
    end loop;
  end if;
  update public.orders set status=next_status,updated_at=now() where id=p_order_id;
end $$;

revoke all on function public.update_store_order_status(uuid,text) from public,anon;
grant execute on function public.update_store_order_status(uuid,text) to authenticated;
