-- SPHINX initial production schema. Run once in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin') $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$ begin insert into public.profiles(id) values(new.id) on conflict do nothing; return new; end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  image text not null default '', active boolean not null default true,
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  category_slug text not null references public.categories(slug) on update cascade,
  description text not null default '', price integer not null check(price >= 0),
  old_price integer check(old_price is null or old_price >= 0), currency text not null default 'RUB',
  colors text[] not null default '{}', sizes text[] not null default '{}', images text[] not null default '{}',
  featured boolean not null default false, is_new boolean not null default false, is_sale boolean not null default false,
  in_stock boolean not null default true, material text not null default '', gsm text, fit text not null default '',
  product_type text not null default 'Streetwear' check(product_type in ('Streetwear','Performance')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.collection_products (
  collection_id uuid references public.collections(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  sort_order integer not null default 0, primary key(collection_id, product_id)
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(), title text not null, subtitle text not null default '',
  image text not null default '', cta_text text not null default '', cta_url text not null default '/shop',
  active boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  key text primary key, value jsonb not null, updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), order_number bigint generated always as identity unique,
  customer_name text not null, phone text not null, telegram text, city text not null, comment text,
  total integer not null check(total >= 0), status text not null default 'new'
    check(status in ('new','contacted','confirmed','shipped','completed','cancelled')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, product_name text not null,
  image text not null default '', color text not null, size text not null,
  quantity integer not null check(quantity > 0), unit_price integer not null check(unit_price >= 0)
);

create or replace function public.create_store_order(customer jsonb, items jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_order_id uuid; calculated_total integer; item jsonb;
begin
  if coalesce(trim(customer->>'name'),'') = '' or coalesce(trim(customer->>'phone'),'') = '' or coalesce(trim(customer->>'city'),'') = '' then
    raise exception 'Required customer fields are missing';
  end if;
  if jsonb_array_length(items) = 0 or jsonb_array_length(items) > 30 then raise exception 'Invalid order items'; end if;
  select sum(p.price * greatest(1, least(99, (x->>'quantity')::integer)))::integer into calculated_total
  from jsonb_array_elements(items) x join public.products p on p.id = (x->>'product_id')::uuid where p.in_stock = true;
  if calculated_total is null then raise exception 'No valid products'; end if;
  insert into public.orders(customer_name,phone,telegram,city,comment,total)
  values(trim(customer->>'name'),trim(customer->>'phone'),nullif(trim(customer->>'telegram'),''),trim(customer->>'city'),nullif(trim(customer->>'comment'),''),calculated_total)
  returning id into new_order_id;
  for item in select * from jsonb_array_elements(items) loop
    insert into public.order_items(order_id,product_id,product_name,image,color,size,quantity,unit_price)
    select new_order_id,p.id,p.name,coalesce(p.images[1],''),left(item->>'color',50),left(item->>'size',10),greatest(1,least(99,(item->>'quantity')::integer)),p.price
    from public.products p where p.id=(item->>'product_id')::uuid and p.in_stock=true;
  end loop;
  return new_order_id;
end $$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.banners enable row level security;
alter table public.store_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

revoke all on public.profiles, public.categories, public.products, public.collections, public.collection_products, public.banners, public.store_settings, public.orders, public.order_items from anon, authenticated;
grant select on public.categories, public.products, public.collections, public.collection_products, public.banners, public.store_settings to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.categories, public.products, public.collections, public.collection_products, public.banners, public.store_settings, public.orders, public.order_items to authenticated;
grant usage, select on sequence public.orders_order_number_seq to authenticated;
grant execute on function public.create_store_order(jsonb,jsonb) to anon, authenticated;

create policy "public read active categories" on public.categories for select to anon,authenticated using(true);
create policy "public read available products" on public.products for select to anon,authenticated using(in_stock or public.is_admin());
create policy "public read active collections" on public.collections for select to anon,authenticated using(active or public.is_admin());
create policy "public read collection products" on public.collection_products for select to anon,authenticated using(true);
create policy "public read active banners" on public.banners for select to anon,authenticated using(active or public.is_admin());
create policy "public read settings" on public.store_settings for select to anon,authenticated using(true);
create policy "admins manage profiles" on public.profiles for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage categories" on public.categories for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage products" on public.products for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage collections" on public.collections for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage collection products" on public.collection_products for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage banners" on public.banners for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage settings" on public.store_settings for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins read orders" on public.orders for select to authenticated using(public.is_admin());
create policy "admins update orders" on public.orders for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins read order items" on public.order_items for select to authenticated using(public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "admins upload product images" on storage.objects for insert to authenticated with check(bucket_id='product-images' and public.is_admin());
create policy "admins update product images" on storage.objects for update to authenticated using(bucket_id='product-images' and public.is_admin()) with check(bucket_id='product-images' and public.is_admin());
create policy "admins delete product images" on storage.objects for delete to authenticated using(bucket_id='product-images' and public.is_admin());

insert into public.categories(name,slug,image,sort_order) values
('Футболки','t-shirts','/assets/collections/tshirts-collection.png',1),('Худи','hoodies','/assets/products/lotus-sand.svg',2),
('Свитшоты','sweatshirts','/assets/products/heart-dark.svg',3),('Спорт','sport','/assets/products/performance-dark.svg',4)
on conflict(slug) do nothing;

insert into public.products(id,name,slug,category_slug,description,price,old_price,colors,sizes,images,featured,is_new,is_sale,material,gsm,fit,product_type) values
('00000000-0000-4000-8000-000000000001','Egyptian Power Oversized T-Shirt','egyptian-power-oversized-tshirt','t-shirts','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',3490,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/egyptian-power-dark.svg','/assets/products/egyptian-power-sand.svg'],true,true,false,'100% хлопок','240 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000002','Heart of Egypt T-Shirt','heart-of-egypt-tshirt','t-shirts','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',3490,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/heart-dark.svg','/assets/products/heart-sand.svg'],true,false,false,'100% хлопок','240 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000003','Spirit of Egypt T-Shirt','spirit-of-egypt-tshirt','t-shirts','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',3290,3790,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/spirit-dark.svg','/assets/products/spirit-sand.svg'],true,false,true,'100% хлопок','240 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000004','Lotus / Luxor T-Shirt','lotus-luxor-tshirt','t-shirts','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',3690,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/lotus-dark.svg','/assets/products/lotus-sand.svg'],true,false,false,'100% хлопок','240 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000005','Egyptian Power Hoodie','egyptian-power-hoodie','hoodies','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',5990,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/egyptian-power-sand.svg','/assets/products/egyptian-power-dark.svg'],true,true,false,'100% хлопок','420 GSM','Relaxed Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000006','Spirit of Egypt Hoodie','spirit-of-egypt-hoodie','hoodies','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',5790,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/spirit-sand.svg','/assets/products/spirit-dark.svg'],true,false,false,'100% хлопок','420 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000007','Lotus Hoodie','lotus-hoodie','hoodies','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',5890,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/lotus-sand.svg','/assets/products/lotus-dark.svg'],true,false,false,'100% хлопок','420 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000008','Egyptian Power Sweatshirt','egyptian-power-sweatshirt','sweatshirts','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',4990,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/egyptian-power-dark.svg','/assets/products/egyptian-power-sand.svg'],true,false,false,'100% хлопок','360 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000009','Heart of Egypt Sweatshirt','heart-of-egypt-sweatshirt','sweatshirts','Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.',4890,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/heart-sand.svg','/assets/products/heart-dark.svg'],true,false,false,'100% хлопок','360 GSM','Unisex Oversized','Streetwear'),
('00000000-0000-4000-8000-000000000010','SPHINX Performance Sleeveless','performance-sleeveless','sport','Эластичная быстросохнущая ткань для интенсивных тренировок.',2990,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/performance-dark.svg','/assets/products/performance-sand.svg'],true,false,false,'90% полиэстер, 10% эластан',null,'Athletic','Performance'),
('00000000-0000-4000-8000-000000000011','SPHINX Performance T-Shirt','performance-tshirt','sport','Технологичная футболка с влагоотводящими свойствами.',3290,null,array['Black','White','Sand'],array['XS','S','M','L','XL','XXL'],array['/assets/products/performance-sand.svg','/assets/products/performance-dark.svg'],true,false,false,'90% полиэстер, 10% эластан',null,'Athletic','Performance')
on conflict(slug) do nothing;

insert into public.store_settings(key,value) values
('brand','"SPHINX"'),('tagline','"THE GUARDIAN"'),('telegram','"sphinx2003"'),
('announcement','"Бесплатная доставка от 7 000 ₽"'),('currency','"RUB ₽"') on conflict(key) do nothing;

-- After creating the first user in Authentication > Users, promote it once:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='YOUR_EMAIL');
