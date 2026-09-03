'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/config/site';
import { listOrders, updateOrderStatus } from '@/core/supabase/store';
import type { Order } from '@/types';

const statuses = [
  ['new', 'Новый'], ['contacted', 'Связались'], ['confirmed', 'Подтверждён'],
  ['shipped', 'Отправлен'], ['completed', 'Доставлен'], ['cancelled', 'Отменён'],
] as const;

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  useEffect(() => {
    void listOrders().then(setOrders).catch((loadError) => {
      console.error('[SPHINX_ORDERS_LOAD_ERROR]', loadError);
      setError('Не удалось загрузить заказы из Supabase.');
    });
  }, []);
  const changeStatus = async (order: Order, status: string) => {
    if (!order.databaseId || order.status === status) return;
    if (status === 'cancelled' && !window.confirm('Отменить заказ и вернуть товары на склад?')) return;
    setUpdating(order.id); setError('');
    try {
      await updateOrderStatus(order.databaseId, status);
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
    } catch (statusError) {
      console.error('[SPHINX_ORDER_STATUS_ERROR]', statusError);
      setError('Не удалось изменить статус. Проверьте, что новая миграция применена.');
    } finally { setUpdating(''); }
  };
  return <div className="space-y-5">
    <div className="admin-card"><h2 className="display text-2xl">Заказы</h2><p className="text-xs text-muted mt-2">{orders.length} заказов</p>{error && <p className="text-sm text-red-700 mt-4">{error}</p>}</div>
    {orders.map((order) => <article className="admin-card" key={order.id}>
      <div className="flex flex-wrap justify-between gap-4 border-b pb-5"><div><h3 className="display text-xl">{order.id}</h3><p className="text-xs text-muted mt-1">{order.date}</p></div>
        <select className="field max-w-52" value={order.status} disabled={updating === order.id || order.status === 'cancelled'} onChange={(event) => void changeStatus(order, event.target.value)}>
          {statuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select></div>
      <div className="grid md:grid-cols-2 gap-6 py-5 border-b text-sm"><div className="space-y-2"><p><b>Клиент:</b> {order.customer}</p><p><b>Телефон:</b> <a href={`tel:${order.phone}`}>{order.phone}</a></p><p><b>Город:</b> {order.city}</p>{order.telegram && <p><b>Telegram:</b> {order.telegram}</p>}</div><div><p><b>Комментарий:</b></p><p className="text-muted mt-2">{order.comment || '—'}</p></div></div>
      <div className="divide-y">{order.lines.map((line) => <div className="flex gap-4 py-4 items-center" key={line.id}>{line.image && <Image src={line.image} alt="" width={54} height={68} className="bg-sand object-cover" />}<div className="flex-1 text-sm"><b>{line.productName}</b><p className="text-muted mt-1">{line.color} · {line.size} · {line.quantity} шт.</p></div><b className="text-sm">{formatPrice(line.unitPrice * line.quantity)}</b></div>)}</div>
      <div className="flex justify-between border-t pt-5 text-lg"><b>Итого</b><b>{formatPrice(order.total)}</b></div>
    </article>)}
    {!orders.length && !error && <div className="admin-card text-muted">Заказов пока нет.</div>}
  </div>;
}
