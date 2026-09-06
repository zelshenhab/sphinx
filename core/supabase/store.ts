import { createClient } from './client';
import type { CartItem, Order } from '@/types';

export type OrderReceipt = {
  id: string;
  reference: string;
  total: number;
  discount: number;
  expiresAt: string;
  customer: { name: string; phone: string; telegram: string; city: string; comment: string };
  lines: {
    productId: string;
    name: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export async function createOrder(
  customer: { name: string; phone: string; telegram: string; city: string; comment: string },
  items: CartItem[],
  requestToken: string,
  coupon = '',
) {
  const { data, error } = await createClient().rpc('create_store_order_v2', {
    customer,
    request_token: requestToken,
    coupon,
    items: items.map(({ product, color, size, quantity }) => ({
      product_id: product.id,
      color,
      size,
      quantity,
    })),
  });
  if (error) throw error;
  return data as OrderReceipt;
}

export async function resumeOrder(requestToken: string): Promise<OrderReceipt | null> {
  const { data, error } = await createClient().rpc('resume_store_order', {
    request_token: requestToken,
  });
  if (error) throw error;
  return data as OrderReceipt | null;
}

export async function listOrders(): Promise<Order[]> {
  // Read bounded pages, avoiding Supabase's default row cap and oversized responses.
  const all: Order[] = [];
  for (let page = 0; ; page += 1) {
    const batch = await listOrderPage(page);
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

export async function listOrderPage(page = 0): Promise<Order[]> {
  const { data, error } = await createClient()
    .from('orders')
    .select(
      'id,order_number,customer_name,phone,telegram,city,comment,total,status,created_at,order_items(id,product_name,image,color,size,quantity,unit_price)',
    )
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(page * 100, page * 100 + 99);
  if (error) throw error;
  return (data ?? []).map(mapOrder);
}

type OrderRow = {
  id: string;
  order_number: number;
  customer_name: string;
  phone: string;
  telegram: string | null;
  city: string;
  comment: string | null;
  total: number;
  status: string;
  created_at: string;
  tracking_number?: string | null;
  order_items: {
    id: string;
    product_name: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    unit_price: number;
  }[];
};
function mapOrder(order: OrderRow): Order {
  return {
    id: `SPX-${String(order.order_number).padStart(4, '0')}`,
    databaseId: order.id,
    customer: order.customer_name,
    phone: order.phone,
    telegram: order.telegram ?? undefined,
    city: order.city,
    comment: order.comment ?? undefined,
    items: (order.order_items ?? []).reduce((sum, item) => sum + item.quantity, 0),
    lines: (order.order_items ?? []).map((item) => ({
      id: item.id,
      productName: item.product_name,
      image: item.image,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
    total: order.total,
    date: new Intl.DateTimeFormat('ru-RU').format(new Date(order.created_at)),
    createdAt: order.created_at,
    status: order.status,
  };
}

export type SalesReport = {
  orders: number;
  newToday: number;
  completed: number;
  revenue: number;
  today: number;
  month: number;
  products: [string, number][];
  colors: [string, number][];
  sizes: [string, number][];
};
export type InventoryReport = {
  productId: string;
  color: string;
  size: string;
  reserved: number;
  sold: number;
}[];
export type CustomerReport = {
  name: string;
  phone: string;
  telegram: string | null;
  orders: number;
  total: number;
  last: string;
  color: string | null;
  size: string | null;
};
export async function getSalesReport(): Promise<SalesReport> {
  const { data, error } = await createClient().rpc('admin_sales_report');
  if (error) throw error;
  return data;
}
export async function getInventoryReport(): Promise<InventoryReport> {
  const { data, error } = await createClient().rpc('admin_inventory_report');
  if (error) throw error;
  return data;
}
export async function getCustomerPage(
  search: string,
  page: number,
): Promise<{ rows: CustomerReport[]; total: number }> {
  const { data, error } = await createClient().rpc('admin_customer_page', {
    search_text: search,
    page_number: page,
  });
  if (error) throw error;
  return data;
}
export async function getOrderPage(search = '', status = 'all', city = 'all', days = 0, page = 0) {
  const { data, error } = await createClient().rpc('admin_order_page', {
    search_text: search,
    status_filter: status,
    city_filter: city,
    days_filter: days,
    page_number: page,
  });
  if (error) throw error;
  const rows = data.rows as OrderRow[];
  return {
    orders: rows.map(mapOrder),
    total: data.total as number,
    cities: data.cities as string[],
    tracking: Object.fromEntries(rows.map((row) => [row.id, row.tracking_number ?? ''])),
  };
}

export async function saveOrderTracking(id: string, trackingNumber: string) {
  const { error } = await createClient()
    .from('orders')
    .update({ tracking_number: trackingNumber.trim() })
    .eq('id', id);
  if (error) throw error;
}

export async function loadOrderTracking(): Promise<Record<string, string>> {
  const { data, error } = await createClient()
    .from('orders')
    .select('id,tracking_number')
    .not('tracking_number', 'is', null);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row) => [row.id, String(row.tracking_number ?? '')]));
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await createClient().rpc('update_store_order_status', {
    p_order_id: id,
    next_status: status,
  });
  if (error) throw error;
}

export async function loadSettings<T extends Record<string, string>>(fallback: T): Promise<T> {
  const { data, error } = await createClient().from('store_settings').select('key,value');
  if (error) throw error;
  return (data ?? []).reduce<T>(
    (settings, row) => {
      if (row.key in settings && typeof row.value === 'string')
        settings[row.key as keyof T] = row.value as T[keyof T];
      return settings;
    },
    { ...fallback },
  );
}

export async function saveSettings(settings: Record<string, string>) {
  const { error } = await createClient()
    .from('store_settings')
    .upsert(Object.entries(settings).map(([key, value]) => ({ key, value })));
  if (error) throw error;
}
