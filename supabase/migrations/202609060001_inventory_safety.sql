begin;
alter table public.products add column if not exists size_guide jsonb not null default '[]';

-- Keep a private, append-only history of inventory writes, including order reservations.
create table public.inventory_movements (
  id bigint generated always as identity primary key,
  inventory_key text not null,
  before_value jsonb,
  after_value jsonb,
  actor uuid,
  created_at timestamptz not null default now()
);
alter table public.inventory_movements enable row level security;
grant select on public.inventory_movements to authenticated;
create policy "admins read inventory history" on public.inventory_movements
  for select to authenticated using(public.is_admin());
create function public.audit_inventory_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(new.key, old.key) like 'product_variant_stock:%'
    or coalesce(new.key, old.key) like 'product_stock:%' then
    if tg_op <> 'UPDATE' or old.value is distinct from new.value then
      insert into public.inventory_movements(inventory_key,before_value,after_value,actor)
      values(coalesce(new.key,old.key),old.value,new.value,auth.uid());
    end if;
  end if;
  return coalesce(new,old);
end $$;
create trigger audit_inventory after insert or update or delete on public.store_settings
for each row execute function public.audit_inventory_change();

-- Tracking references are private order data, not public storefront settings.
alter table public.orders add column if not exists tracking_number text;
update public.orders o set tracking_number = s.value #>> '{}'
from public.store_settings s where s.key = 'order_tracking:' || o.id::text;
delete from public.store_settings where key like 'order_tracking:%';
drop policy if exists "public read settings" on public.store_settings;
create policy "public read settings" on public.store_settings for select to anon,authenticated
using (key not like 'order_tracking:%' and key <> 'discount_rules');

-- Compare stock only when the administrator explicitly changes stock.
create function public.save_product_safely(
  product_id uuid, fields jsonb, color_images jsonb,
  expected_stock jsonb default null, next_stock jsonb default null
) returns void language plpgsql security definer set search_path = '' as $$
declare current_product public.products%rowtype; proposed public.products%rowtype;
  actual_stock jsonb; stock_key text; entry record;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  select * into current_product from public.products where id=product_id for update;
  if not found then raise exception 'Product not found'; end if;
  proposed := jsonb_populate_record(current_product, fields);
  stock_key := 'product_variant_stock:' || product_id::text;
  select value into actual_stock from public.store_settings where key=stock_key for update;
  if next_stock is not null then
    if coalesce(actual_stock,'{}'::jsonb) is distinct from coalesce(expected_stock,'{}'::jsonb) then
      raise exception 'STOCK_CONFLICT: Inventory changed. Reload before saving.';
    end if;
    if jsonb_typeof(next_stock) <> 'object' then raise exception 'Invalid stock'; end if;
    for entry in select * from jsonb_each_text(next_stock) loop
      if entry.value !~ '^[0-9]+$' or entry.value::numeric > 1000000 then
        raise exception 'Invalid stock quantity';
      end if;
    end loop;
    insert into public.store_settings(key,value) values(stock_key,next_stock)
      on conflict(key) do update set value=excluded.value,updated_at=now();
    insert into public.store_settings(key,value)
      select 'product_stock:' || product_id::text,to_jsonb(coalesce(sum(value::integer),0)) from jsonb_each_text(next_stock)
      on conflict(key) do update set value=excluded.value,updated_at=now();
  end if;
  update public.products set name=proposed.name,slug=proposed.slug,category_slug=proposed.category_slug,
    description=proposed.description,price=proposed.price,old_price=proposed.old_price,
    colors=proposed.colors,sizes=proposed.sizes,images=proposed.images,featured=proposed.featured,
    is_new=proposed.is_new,is_sale=proposed.is_sale,material=proposed.material,gsm=proposed.gsm,
    fit=proposed.fit,product_type=proposed.product_type,size_guide=proposed.size_guide,updated_at=now()
    where id=product_id;
  insert into public.store_settings(key,value) values('product_color_images:' || product_id::text,color_images)
    on conflict(key) do update set value=excluded.value,updated_at=now();
end $$;
revoke all on function public.save_product_safely(uuid,jsonb,jsonb,jsonb,jsonb) from public,anon;
grant execute on function public.save_product_safely(uuid,jsonb,jsonb,jsonb,jsonb) to authenticated;
commit;
