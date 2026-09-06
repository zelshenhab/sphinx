begin;
create index if not exists orders_status_created_idx on public.orders(status,created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);

create or replace function public.resume_store_order(request_token uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare saved public.orders%rowtype;
begin
  if request_token is null then return null; end if;
  perform public.expire_store_reservations();
  select * into saved from public.orders o where o.request_token=resume_store_order.request_token;
  if not found then return null; end if;
  if saved.status='cancelled' then raise exception 'RESERVATION_EXPIRED'; end if;
  return saved.receipt;
end $$;

create or replace function public.create_product_safely(fields jsonb,color_images jsonb,variant_stock jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare product_row public.products%rowtype; product_id uuid; entry record;
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  if jsonb_typeof(coalesce(variant_stock,'{}'))<>'object' then raise exception 'INVALID_STOCK'; end if;
  for entry in select * from jsonb_each_text(coalesce(variant_stock,'{}')) loop
    if entry.value !~ '^[0-9]+$' or entry.value::numeric>1000000 then raise exception 'INVALID_STOCK'; end if;
  end loop;
  product_row:=jsonb_populate_record(null::public.products,fields);
  insert into public.products(name,slug,category_slug,description,price,old_price,colors,sizes,images,
    featured,is_new,is_sale,material,gsm,fit,product_type,in_stock,size_guide)
  values(product_row.name,product_row.slug,product_row.category_slug,product_row.description,product_row.price,
    product_row.old_price,product_row.colors,product_row.sizes,product_row.images,product_row.featured,
    product_row.is_new,product_row.is_sale,product_row.material,product_row.gsm,product_row.fit,
    product_row.product_type,true,coalesce(product_row.size_guide,'[]')) returning id into product_id;
  insert into public.store_settings(key,value) values
    ('product_color_images:'||product_id,color_images),
    ('product_variant_stock:'||product_id,variant_stock),
    ('product_stock:'||product_id,(select to_jsonb(coalesce(sum(value::integer),0)) from jsonb_each_text(variant_stock)));
  return product_id;
end $$;

create or replace function public.delete_product_safely(product_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  delete from public.products where id=product_id;
  if not found then raise exception 'PRODUCT_NOT_FOUND'; end if;
  delete from public.store_settings where key in ('product_color_images:'||product_id,'product_stock:'||product_id,
    'product_size_stock:'||product_id,'product_variant_stock:'||product_id);
end $$;

-- Never send the full customer/order history to a reporting screen.
create or replace function public.admin_sales_report() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb; day_start timestamptz; month_start timestamptz;
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  day_start := date_trunc('day',now() at time zone 'Europe/Moscow') at time zone 'Europe/Moscow';
  month_start := date_trunc('month',now() at time zone 'Europe/Moscow') at time zone 'Europe/Moscow';
  select jsonb_build_object(
    'orders',count(*),'newToday',count(*) filter(where status='new' and created_at>=day_start),
    'completed',count(*) filter(where status='completed'),
    'revenue',coalesce(sum(total) filter(where status='completed'),0),
    'today',coalesce(sum(total) filter(where status='completed' and created_at>=day_start),0),
    'month',coalesce(sum(total) filter(where status='completed' and created_at>=month_start),0)
  ) into result from public.orders;
  return result || jsonb_build_object(
    'products',(select coalesce(jsonb_agg(jsonb_build_array(name,qty)),'[]') from
      (select max(i.product_name) name,sum(i.quantity) qty from public.order_items i
       join public.orders o on o.id=i.order_id where o.status='completed'
       group by coalesce(i.product_id::text,i.product_name) order by qty desc,name limit 5) x),
    'colors',(select coalesce(jsonb_agg(jsonb_build_array(color,qty)),'[]') from
      (select i.color,sum(i.quantity) qty from public.order_items i join public.orders o on o.id=i.order_id
       where o.status='completed' group by i.color order by qty desc,i.color limit 5) x),
    'sizes',(select coalesce(jsonb_agg(jsonb_build_array(size,qty)),'[]') from
      (select i.size,sum(i.quantity) qty from public.order_items i join public.orders o on o.id=i.order_id
       where o.status='completed' group by i.size order by qty desc,i.size limit 5) x));
end $$;

create or replace function public.admin_inventory_report() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  return (select coalesce(jsonb_agg(to_jsonb(x)),'[]') from (
    select i.product_id as "productId",i.color,i.size,
      coalesce(sum(i.quantity) filter(where o.status in ('new','contacted','confirmed')),0) reserved,
      coalesce(sum(i.quantity) filter(where o.status in ('shipped','completed')),0) sold
    from public.order_items i join public.orders o on o.id=i.order_id
    where i.product_id is not null and o.status<>'cancelled'
    group by i.product_id,i.color,i.size
  ) x);
end $$;

create or replace function public.admin_customer_page(search_text text default '',page_number integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  return (with active_orders as (
    select *,regexp_replace(phone,'[^0-9]','','g') customer_key from public.orders where status<>'cancelled'
  ), customers as (
    select customer_key,(array_agg(customer_name order by created_at desc,id desc))[1] name,
      (array_agg(phone order by created_at desc,id desc))[1] phone,
      (array_agg(telegram order by created_at desc,id desc))[1] telegram,
      count(*) orders,coalesce(sum(total) filter(where status='completed'),0) total,max(created_at) last
    from active_orders group by customer_key
  ), matched as (
    select * from customers where position(lower(left(trim(search_text),200)) in lower(concat_ws(' ',name,phone,telegram,customer_key)))>0
  ), paged as (
    select * from matched order by last desc,customer_key limit 24 offset greatest(0,least(page_number,100000))*24
  ) select jsonb_build_object('total',(select count(*) from matched),'rows',coalesce((select jsonb_agg(to_jsonb(p) || jsonb_build_object(
    'color',(select i.color from public.order_items i join active_orders o on o.id=i.order_id where o.customer_key=p.customer_key group by i.color order by sum(i.quantity) desc,i.color limit 1),
    'size',(select i.size from public.order_items i join active_orders o on o.id=i.order_id where o.customer_key=p.customer_key group by i.size order by sum(i.quantity) desc,i.size limit 1)
  )) from paged p),'[]')));
end $$;

create or replace function public.admin_order_page(search_text text default '',status_filter text default 'all',city_filter text default 'all',days_filter integer default 0,page_number integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  return (with matched as (
    select * from public.orders where
      (status_filter='all' or status=status_filter) and
      (city_filter='all' or trim(split_part(city,',',1))=city_filter) and
      (days_filter<=0 or created_at>=now()-make_interval(days=>least(days_filter,3650))) and
      position(lower(left(trim(search_text),200)) in lower(concat_ws(' ','SPX-'||lpad(order_number::text,greatest(4,length(order_number::text)),'0'),customer_name,phone,telegram)))>0
  ), paged as (
    select * from matched order by created_at desc,id desc limit 24 offset greatest(0,least(page_number,100000))*24
  ) select jsonb_build_object('total',(select count(*) from matched),
    'cities',(select coalesce(jsonb_agg(c order by c),'[]') from (select distinct trim(split_part(city,',',1)) c from public.orders where city<>'') cities),
    'rows',coalesce((select jsonb_agg((to_jsonb(p)-'receipt'-'request_token')||jsonb_build_object('order_items',
      (select coalesce(jsonb_agg(to_jsonb(i) order by i.id),'[]') from public.order_items i where i.order_id=p.id)) order by p.created_at desc,p.id desc) from paged p),'[]')));
end $$;
revoke all on function public.resume_store_order(uuid),public.create_product_safely(jsonb,jsonb,jsonb),public.delete_product_safely(uuid),public.admin_sales_report(),public.admin_inventory_report(),public.admin_customer_page(text,integer),public.admin_order_page(text,text,text,integer,integer) from public;
grant execute on function public.resume_store_order(uuid) to anon,authenticated;
grant execute on function public.create_product_safely(jsonb,jsonb,jsonb),public.delete_product_safely(uuid),public.admin_sales_report(),public.admin_inventory_report(),public.admin_customer_page(text,integer),public.admin_order_page(text,text,text,integer,integer) to authenticated;
commit;
