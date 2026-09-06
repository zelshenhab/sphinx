import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Pass the PGlite module path so test-only dependencies need not ship to production.
const { PGlite } = await import(process.argv[2]);
const db = new PGlite();
const read = (name) => readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8');
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('app.user',true),'')::uuid $$;`);
const initial = await read('202609010001_initial_schema.sql');
await db.exec(
  initial.slice(
    initial.indexOf('create table'),
    initial.indexOf('create or replace function public.create_store_order'),
  ),
);
await db.exec(await read('202609030001_variant_inventory.sql'));
await db.exec(
  initial.slice(
    initial.indexOf('alter table public.profiles enable'),
    initial.indexOf('insert into storage.buckets'),
  ),
);
await db.exec(await read('202609060001_inventory_safety.sql'));
await db.exec(await read('202609060002_order_receipts.sql'));
await db.exec(await read('202609060003_admin_reports.sql'));
const admin = '00000000-0000-4000-8000-000000000001';
const product = '00000000-0000-4000-8000-000000000002';
await db.exec(`insert into auth.users values('${admin}'); update public.profiles set role='admin';
select set_config('app.user','${admin}',false);
insert into public.categories(name,slug) values('T-shirts','t-shirts');
insert into public.products(id,name,slug,category_slug,price,colors,sizes) values('${product}','Test shirt','test-shirt','t-shirts',1000,array['Black'],array['M']);
insert into public.store_settings(key,value) values('product_variant_stock:${product}','{"Black::M":10}');`);
const scalar = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const stock = async () =>
  Number(
    (
      await scalar("select value->>'Black::M' as stock from public.store_settings where key=$1", [
        `product_variant_stock:${product}`,
      ])
    ).stock,
  );
const customer = { name: 'Test Customer', phone: '+79990000000', city: 'Test street' };
const items = [{ product_id: product, color: 'Black', size: 'M', quantity: 2 }];
const order = async (token, coupon = '') =>
  (
    await scalar('select public.create_store_order_v2($1,$2,$3,$4) receipt', [
      customer,
      JSON.stringify(items),
      token,
      coupon,
    ])
  ).receipt;
const token = '00000000-0000-4000-8000-000000000003';
const receipt = await order(token);
assert.equal(receipt.total, 2000);
assert.equal(receipt.reference, 'SPX-0001');
assert.equal(await stock(), 8);
assert.deepEqual(await order(token), receipt);
assert.deepEqual(
  (await scalar('select public.resume_store_order($1) receipt', [token])).receipt,
  receipt,
);
assert.equal(await stock(), 8, 'idempotent retry must not reserve twice');
await db.query('select public.save_product_safely($1,$2,$3)', [product, { price: 1200 }, {}]);
assert.equal(await stock(), 8, 'price-only edit must preserve stock');
await assert.rejects(
  db.query('select public.save_product_safely($1,$2,$3,$4,$5)', [
    product,
    { price: 1400 },
    {},
    { 'Black::M': 10 },
    { 'Black::M': 12 },
  ]),
  /STOCK_CONFLICT/,
);
assert.equal(
  (await scalar('select price from public.products where id=$1', [product])).price,
  1200,
);
await db.query('select public.save_product_safely($1,$2,$3,$4,$5)', [
  product,
  { price: 1200 },
  {},
  { 'Black::M': 8 },
  { 'Black::M': 12 },
]);
assert.equal(await stock(), 12);
const discount = [
  {
    id: 'percent',
    code: 'TEN',
    active: true,
    type: 'percent',
    value: 10,
    minimum: 0,
    usageLimit: 1,
    expiresAt: '',
    target: 'all',
    automatic: false,
  },
];
await db.query("insert into public.store_settings(key,value) values('discount_rules',$1)", [
  JSON.stringify(discount),
]);
const discounted = await order('00000000-0000-4000-8000-000000000004', 'TEN');
assert.equal(discounted.total, 2160);
assert.equal(discounted.discount, 240);
await assert.rejects(order('00000000-0000-4000-8000-000000000005', 'TEN'), /COUPON_INVALID/);
assert.equal(await stock(), 10, 'invalid coupon must roll back reservation');
await db.query("update public.orders set expires_at=now()-interval '1 second' where id=$1", [
  receipt.id,
]);
await db.exec(
  'select public.expire_store_reservations(); select public.expire_store_reservations();',
);
assert.equal(await stock(), 12, 'expiration must release stock once');
await assert.rejects(order(token), /RESERVATION_EXPIRED/);
await db.exec("insert into public.store_settings(key,value) values('orders_enabled','\"false\"')");
await assert.rejects(order('00000000-0000-4000-8000-000000000006'), /ORDERS_PAUSED/);
assert.ok(Number((await scalar('select count(*) n from public.inventory_movements')).n) > 0);
const sales = (await scalar('select public.admin_sales_report() report')).report;
assert.equal(sales.orders, 2);
assert.equal(sales.completed, 0);
assert.equal(sales.revenue, 0, 'unpaid new orders are not delivered sales');
const customerPage = (await scalar("select public.admin_customer_page('Test',0) report")).report;
assert.equal(customerPage.total, 1);
assert.equal(customerPage.rows[0].orders, 1, 'cancelled orders excluded');
assert.equal(customerPage.rows[0].total, 0);
const orderPage = (await scalar("select public.admin_order_page('SPX-0001') report")).report;
assert.equal(orderPage.total, 1);
assert.equal(orderPage.rows[0].order_items.length, 1);
assert.equal('request_token' in orderPage.rows[0], false);
assert.equal((await scalar('select public.admin_inventory_report() report')).report[0].reserved, 2);
await db.exec("update public.store_settings set value='\"true\"' where key='orders_enabled'");
let scenario = 10;
const couponOrder = async (rule, quantity = 2, code = rule.code) => {
  scenario += 1;
  await db.query("update public.store_settings set value=$1 where key='discount_rules'", [
    JSON.stringify([rule]),
  ]);
  return (
    await scalar('select public.create_store_order_v2($1,$2,$3,$4) receipt', [
      { ...customer, phone: `+7999000${String(scenario).padStart(4, '0')}` },
      JSON.stringify([{ ...items[0], quantity }]),
      `00000000-0000-4000-8000-${String(scenario).padStart(12, '0')}`,
      code,
    ])
  ).receipt;
};
const baseRule = {
  id: 'test-rule',
  active: true,
  automatic: false,
  code: 'TEST',
  target: 'all',
  type: 'fixed',
  value: 500,
  minimum: 0,
  usageLimit: 100,
};
const fixed = await couponOrder(baseRule);
assert.equal(fixed.discount, 500);
assert.equal(fixed.total, 1900);
await db.query("select public.update_store_order_status($1,'cancelled')", [fixed.id]);
const capped = await couponOrder({ ...baseRule, value: 99999 });
assert.equal(capped.total, 0, 'fixed reduction capped at eligible subtotal');
await db.query("select public.update_store_order_status($1,'cancelled')", [capped.id]);
const bogo = await couponOrder({ ...baseRule, type: 'bogo' }, 3);
assert.equal(bogo.discount, 1200);
assert.equal(bogo.total, 2400, 'odd unit must be paid');
await db.query("select public.update_store_order_status($1,'cancelled')", [bogo.id]);
const beforeInvalid = await stock();
await assert.rejects(couponOrder({ ...baseRule, target: 'unrelated' }), /COUPON_INVALID/);
await assert.rejects(couponOrder({ ...baseRule, minimum: 99999 }), /COUPON_INVALID/);
await assert.rejects(couponOrder({ ...baseRule, expiresAt: '2000-01-01' }), /COUPON_INVALID/);
assert.equal(await stock(), beforeInvalid, 'every rejected rule rolls back stock');
const collection = '00000000-0000-4000-8000-000000000099';
await db.query(
  "insert into public.collections(id,name,slug) values($1,'Test collection','test-collection')",
  [collection],
);
await db.query('insert into public.collection_products(collection_id,product_id) values($1,$2)', [
  collection,
  product,
]);
const targeted = await couponOrder({ ...baseRule, target: 'test-collection' });
assert.equal(targeted.discount, 500);
await db.query("select public.update_store_order_status($1,'cancelled')", [targeted.id]);
const automatic = await couponOrder({ ...baseRule, automatic: true }, 2, '');
assert.equal(automatic.discount, 500);
await db.query("select public.update_store_order_status($1,'completed')", [automatic.id]);
assert.equal((await scalar('select public.admin_sales_report() report')).report.revenue, 1900);
// Pagination is real: the server sends at most 24 records, not every order.
await db.exec(
  "insert into public.orders(customer_name,phone,city,total,status) select 'Page Test', '+7000'||n, 'Test',0,'cancelled' from generate_series(1,30) n",
);
const firstPage = (await scalar("select public.admin_order_page('Page Test') report")).report;
const secondPage = (
  await scalar("select public.admin_order_page('Page Test','all','all',0,1) report")
).report;
assert.equal(firstPage.total, 30);
assert.equal(firstPage.rows.length, 24);
assert.equal(secondPage.rows.length, 6);
assert.equal(new Set([...firstPage.rows, ...secondPage.rows].map((row) => row.id)).size, 30);
const created = (
  await scalar("select public.create_product_safely($1,'{}','{\"Sand::L\":4}') id", [
    {
      name: 'Atomic product',
      slug: 'atomic-product',
      category_slug: 't-shirts',
      description: 'Test',
      price: 500,
      colors: ['Sand'],
      sizes: ['L'],
      images: ['/test.jpg'],
      featured: false,
      is_new: false,
      is_sale: false,
      material: 'Cotton',
      fit: 'Regular',
      product_type: 'Streetwear',
      size_guide: [],
    },
  ])
).id;
assert.equal(
  Number(
    (
      await scalar(
        "select value #>> '{}' stock from public.store_settings where key='product_stock:'||$1",
        [created],
      )
    ).stock,
  ),
  4,
);
await db.query('select public.delete_product_safely($1)', [created]);
assert.equal(
  Number((await scalar('select count(*) n from public.products where id=$1', [created])).n),
  0,
);
assert.equal(
  Number(
    (await scalar("select count(*) n from public.store_settings where key like '%'||$1", [created]))
      .n,
  ),
  0,
);
await db.exec("select set_config('app.user','',false); set role anon;");
await assert.rejects(db.query('select public.admin_sales_report()'), /permission denied/);
await assert.rejects(
  db.query("select public.create_product_safely('{}','{}','{}')"),
  /permission denied/,
);
assert.equal(
  (await db.query("select * from public.store_settings where key='discount_rules'")).rows.length,
  0,
);
await assert.rejects(
  db.query('select public.create_store_order($1,$2)', [customer, JSON.stringify(items)]),
  /permission denied/,
);
await assert.rejects(
  db.query('select public.save_product_safely($1,$2,$3)', [product, { price: 1 }, {}]),
  /permission denied/,
);
await db.exec('reset role');
await db.close();
console.log(
  'PASS: receipts, idempotency, stock conflicts, atomic edits, coupons, expiry, order pause, audit history',
);
