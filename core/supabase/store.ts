import { createClient } from './client';
import type { CartItem, Order } from '@/types';

export async function createOrder(
  customer: { name: string; phone: string; telegram: string; city: string; comment: string },
  items: CartItem[],
) {
  const { data, error } = await createClient().rpc('create_store_order', {
    customer,
    items: items.map(({ product, color, size, quantity }) => ({
      product_id: product.id,
      color,
      size,
      quantity,
    })),
  });
  if (error) throw error;
  return data as string;
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await createClient()
    .from('orders')
    .select('id,order_number,customer_name,phone,telegram,city,comment,total,status,created_at,order_items(id,product_name,image,color,size,quantity,unit_price)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((order) => ({
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
  }));
}

export async function saveOrderTracking(id: string, trackingNumber: string) {
  const { error } = await createClient().from('store_settings').upsert({
    key: `order_tracking:${id}`,
    value: trackingNumber.trim(),
  });
  if (error) throw error;
}

export async function loadOrderTracking(): Promise<Record<string, string>> {
  const { data, error } = await createClient()
    .from('store_settings')
    .select('key,value')
    .like('key', 'order_tracking:%');
  if (error) throw error;
  return Object.fromEntries(
    (data ?? []).map((row) => [row.key.replace('order_tracking:', ''), String(row.value ?? '')]),
  );
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
