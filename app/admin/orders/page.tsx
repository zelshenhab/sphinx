'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Copy, Search, Send, ShoppingBag, Truck } from 'lucide-react';
import { formatPrice } from '@/config/site';
import { listOrders, loadOrderTracking, saveOrderTracking, updateOrderStatus } from '@/core/supabase/store';
import type { Order } from '@/types';

const statuses = [
  ['new', 'Новый'],
  ['contacted', 'Связались'],
  ['confirmed', 'Подтверждён'],
  ['shipped', 'Отправлен'],
  ['completed', 'Доставлен'],
  ['cancelled', 'Отменён'],
] as const;

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [now] = useState(() => Date.now());
  useEffect(() => {
    void Promise.all([listOrders(), loadOrderTracking()])
      .then(([loadedOrders, loadedTracking]) => { setOrders(loadedOrders); setTracking(loadedTracking); })
      .catch((loadError) => {
        console.error('[SPHINX_ORDERS_LOAD_ERROR]', loadError);
        setError('Не удалось загрузить заказы из Supabase.');
      });
  }, []);
  const changeStatus = async (order: Order, status: string) => {
    if (!order.databaseId || order.status === status) return;
    if (status === 'cancelled' && !window.confirm('Отменить заказ и вернуть товары на склад?'))
      return;
    setUpdating(order.id);
    setError('');
    try {
      await updateOrderStatus(order.databaseId, status);
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, status } : item)),
      );
    } catch (statusError) {
      console.error('[SPHINX_ORDER_STATUS_ERROR]', statusError);
      setError('Не удалось изменить статус. Проверьте, что новая миграция применена.');
    } finally {
      setUpdating('');
    }
  };
  const filteredOrders = orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.phone} ${order.telegram ?? ''}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCity = cityFilter === 'all' || order.city.split(',')[0].trim() === cityFilter;
    const created = new Date(order.createdAt ?? 0).getTime();
    const days = dateFilter === '7' ? 7 : dateFilter === '30' ? 30 : 0;
    const matchesDate = !days || created >= now - days * 86400000;
    return matchesQuery && matchesStatus && matchesCity && matchesDate;
  });
  const cities = Array.from(new Set(orders.map((order) => order.city.split(',')[0].trim()))).filter(Boolean);
  const customerMessage = (order: Order) => `Здравствуйте, ${order.customer}!\nВаш заказ ${order.id} в SPHINX${tracking[order.databaseId ?? ''] ? ` отправлен. Трек-номер: ${tracking[order.databaseId ?? '']}` : ' принят в работу'}.\nСумма: ${formatPrice(order.total)}.`;
  return (
    <div className="space-y-5">
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="display text-2xl">Заказы</h2>
            <p className="text-xs text-muted mt-2">
              {orders.length} заказов · {orders.filter((order) => order.status === 'new').length}{' '}
              новых
            </p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-2 w-full xl:w-auto">
            <label className="relative">
              <span className="sr-only">Поиск заказов</span>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="field search-field"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Имя, телефон, номер"
              />
            </label>
            <select
              aria-label="Статус заказа"
              className="field"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Все статусы</option>
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select className="field" value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}><option value="all">Все города</option>{cities.map((city) => <option key={city}>{city}</option>)}</select>
            <select className="field" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}><option value="all">За всё время</option><option value="7">Последние 7 дней</option><option value="30">Последние 30 дней</option></select>
          </div>
        </div>
        {error && <p className="text-sm text-red-700 mt-4">{error}</p>}
      </div>
      {filteredOrders.map((order) => (
        <article className="admin-card" key={order.id}>
          <div className="flex flex-wrap justify-between gap-4 border-b pb-5">
            <div>
              <h3 className="display text-xl">{order.id}</h3>
              <p className="text-xs text-muted mt-1">{order.date}</p>
            </div>
            <select
              className="field max-w-52"
              value={order.status}
              disabled={updating === order.id || order.status === 'cancelled'}
              onChange={(event) => void changeStatus(order, event.target.value)}
            >
              {statuses.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-6 py-5 border-b text-sm">
            <div className="space-y-2">
              <p>
                <b>Клиент:</b> {order.customer}
              </p>
              <p>
                <b>Телефон:</b> <a href={`tel:${order.phone}`}>{order.phone}</a>
              </p>
              <p>
                <b>Город:</b> {order.city}
              </p>
              {order.telegram && (
                <p>
                  <b>Telegram:</b> {order.telegram}
                </p>
              )}
            </div>
            <div>
              <p>
                <b>Комментарий:</b>
              </p>
              <p className="text-muted mt-2">{order.comment || '—'}</p>
            </div>
          </div>
          <div className="divide-y">
            {order.lines.map((line) => (
              <div className="flex gap-3 sm:gap-4 py-4 items-center" key={line.id}>
                {line.image && (
                  <Image
                    src={line.image}
                    alt=""
                    width={54}
                    height={68}
                    className="bg-sand object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 text-sm">
                  <b className="block truncate">{line.productName}</b>
                  <p className="text-muted mt-1">
                    {line.color} · {line.size} · {line.quantity} шт.
                  </p>
                </div>
                <b className="text-sm shrink-0">{formatPrice(line.unitPrice * line.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-5 text-lg">
            <b>Итого</b>
            <b>{formatPrice(order.total)}</b>
          </div>
          <div className="border-t mt-5 pt-5 grid md:grid-cols-[1fr_auto] gap-3">
            <label className="relative"><Truck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input className="field search-field" placeholder="Номер отправления" value={tracking[order.databaseId ?? ''] ?? ''} onChange={(event) => setTracking((current) => ({...current, [order.databaseId ?? '']: event.target.value}))} onBlur={() => order.databaseId && void saveOrderTracking(order.databaseId, tracking[order.databaseId] ?? '')} /></label>
            <div className="flex gap-2">
              <button onClick={() => void navigator.clipboard.writeText(customerMessage(order))} className="btn border border-ink"><Copy size={15} /> Копировать</button>
              {order.telegram && <a target="_blank" href={`https://t.me/${order.telegram.replace('@','')}?text=${encodeURIComponent(customerMessage(order))}`} className="btn btn-dark"><Send size={15} /> Telegram</a>}
            </div>
          </div>
        </article>
      ))}
      {!filteredOrders.length && !error && (
        <div className="admin-card text-muted text-center py-12">
          <ShoppingBag className="mx-auto mb-3" size={24} />
          {orders.length ? 'Заказы по выбранным фильтрам не найдены.' : 'Заказов пока нет.'}
        </div>
      )}
    </div>
  );
}
