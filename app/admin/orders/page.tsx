'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Copy, Search, Send, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/config/site';
import { getOrderPage, updateOrderStatus } from '@/core/supabase/store';
import { Pagination } from '@/features/admin/components/pagination';
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
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      void getOrderPage(query, statusFilter, cityFilter, Number(dateFilter) || 0, page)
        .then((result) => {
          if (active) {
            setOrders(result.orders);
            setTotal(result.total);
            setCities(result.cities);
          }
        })
        .catch((loadError) => {
          console.error('[SPHINX_ORDERS_LOAD_ERROR]', loadError);
          if (active) setError('Не удалось загрузить заказы из Supabase.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, statusFilter, cityFilter, dateFilter, page, revision]);
  const resetPage = () => {
    setPage(0);
    setLoading(true);
  };
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
      setRevision((value) => value + 1);
    } catch (statusError) {
      console.error('[SPHINX_ORDER_STATUS_ERROR]', statusError);
      setError('Не удалось изменить статус. Проверьте, что новая миграция применена.');
    } finally {
      setUpdating('');
    }
  };
  const filteredOrders = loading ? [] : orders;
  const customerMessage = (order: Order) =>
    `Здравствуйте, ${order.customer}!\nВаш заказ ${order.id} в SPHINX принят в работу.\nСумма: ${formatPrice(order.total)}.`;
  return (
    <div className="space-y-5">
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="display text-2xl">Заказы</h2>
            <p className="text-xs text-muted mt-2">
              {loading ? 'Загрузка…' : `${total} заказов по выбранным фильтрам`}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-2 w-full xl:w-auto">
            <label className="relative">
              <span className="sr-only">Поиск заказов</span>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="field search-field"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  resetPage();
                }}
                placeholder="Имя, телефон, номер"
              />
            </label>
            <select
              aria-label="Статус заказа"
              className="field"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                resetPage();
              }}
            >
              <option value="all">Все статусы</option>
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              aria-label="Город"
              className="field"
              value={cityFilter}
              onChange={(event) => {
                setCityFilter(event.target.value);
                resetPage();
              }}
            >
              <option value="all">Все города</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <select
              aria-label="Период"
              className="field"
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value);
                resetPage();
              }}
            >
              <option value="all">За всё время</option>
              <option value="7">Последние 7 дней</option>
              <option value="30">Последние 30 дней</option>
            </select>
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
          <div className="border-t mt-5 pt-5 flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => void navigator.clipboard.writeText(customerMessage(order))}
                className="btn border border-ink"
              >
                <Copy size={15} /> Копировать
              </button>
              {order.telegram && (
                <a
                  target="_blank"
                  href={`https://t.me/${order.telegram.replace('@', '')}?text=${encodeURIComponent(customerMessage(order))}`}
                  className="btn btn-dark"
                >
                  <Send size={15} /> Telegram
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
      {!filteredOrders.length && !error && !loading && (
        <div className="admin-card text-muted text-center py-12">
          <ShoppingBag className="mx-auto mb-3" size={24} />
          {orders.length ? 'Заказы по выбранным фильтрам не найдены.' : 'Заказов пока нет.'}
        </div>
      )}
      <Pagination
        page={page}
        total={total}
        disabled={loading}
        onChange={(next) => {
          setPage(next);
          setLoading(true);
        }}
      />
    </div>
  );
}
