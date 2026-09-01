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
    .select('id,order_number,customer_name,total,status,created_at,order_items(quantity)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((order) => ({
    id: `SPX-${String(order.order_number).padStart(4, '0')}`,
    customer: order.customer_name,
    items: (order.order_items ?? []).reduce((sum, item) => sum + item.quantity, 0),
    total: order.total,
    date: new Intl.DateTimeFormat('ru-RU').format(new Date(order.created_at)),
    status: order.status,
  }));
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
