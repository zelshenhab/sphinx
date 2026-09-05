'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/features/catalog';
import { formatPrice } from '@/config/site';
import { AlertTriangle, ArrowUpRight, ImagePlus, Layers, PackagePlus, TrendingUp } from 'lucide-react';
import { listOrders } from '@/core/supabase/store';
import type { Order } from '@/types';
export default function Admin() {
  const { products, categories, loading } = useCatalog();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { void listOrders().then(setOrders).catch(() => setOrders([])); }, []);
  const sales = useMemo(() => {
    const now = new Date();
    const valid = orders.filter((order) => order.status !== 'cancelled');
    const today = valid.filter((order) => order.createdAt && new Date(order.createdAt).toDateString() === now.toDateString());
    const month = valid.filter((order) => { const date = new Date(order.createdAt ?? 0); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); });
    return { today: today.reduce((sum, order) => sum + order.total, 0), month: month.reduce((sum, order) => sum + order.total, 0), average: valid.length ? Math.round(valid.reduce((sum, order) => sum + order.total, 0) / valid.length) : 0 };
  }, [orders]);
  const lowStockProducts = products
    .filter((product) => (product.stockQuantity ?? 20) <= 10)
    .sort((a, b) => (a.stockQuantity ?? 20) - (b.stockQuantity ?? 20));
  const stats = [
    ['Всего заказов', orders.length],
    ['Новых сегодня', orders.filter((order) => order.status === 'new' && order.createdAt && new Date(order.createdAt).toDateString() === new Date().toDateString()).length],
    ['Продажи сегодня', formatPrice(sales.today)],
    ['Продажи за месяц', formatPrice(sales.month)],
    ['Средний чек', formatPrice(sales.average)],
    ['Мало на складе', lowStockProducts.length],
  ];
  return (
    <>
      <div className="admin-card mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ink text-white">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Quick start</p>
          <h2 className="display text-2xl mt-2">Управление магазином</h2>
          <p className="text-sm text-white/60 mt-2">Товары, остатки и заказы — в одном месте.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products" className="btn bg-white text-ink">
            <PackagePlus size={16} /> Добавить товар
          </Link>
          <Link href="/admin/collections" className="btn border border-white/30 text-white"><Layers size={16} /> К коллекциям</Link>
          <Link href="/admin/banners" className="btn border border-white/30 text-white"><ImagePlus size={16} /> К баннерам</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((x) => (
          <div className="admin-card" key={x[0]}>
            <p className="text-xs text-muted">{x[0]}</p>
            <b className="display text-4xl block mt-4">{loading ? '—' : x[1]}</b>
          </div>
        ))}
      </div>
      <div className="grid xl:grid-cols-2 gap-5 mt-5">
        <div className="admin-card">
          <div className="flex justify-between items-center mb-5">
            <h2 className="display text-2xl">Последние заказы</h2>
            <Link href="/admin/orders" className="text-xs underline flex items-center gap-1">
              Все <ArrowUpRight size={13} />
            </Link>
          </div>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex justify-between gap-4 border-t py-3 text-sm">
              <span className="truncate">{order.id} · {order.customer}</span>
              <b className="shrink-0">{formatPrice(order.total)}</b>
            </div>
          ))}
          {!orders.length && <p className="border-t py-4 text-sm text-muted">Заказов пока нет.</p>}
        </div>
        <div className="admin-card">
          <div className="flex justify-between items-center mb-5">
            <h2 className="display text-2xl">Контроль склада</h2>
            <AlertTriangle
              size={18}
              className={lowStockProducts.length ? 'text-gold' : 'text-green-700'}
            />
          </div>
          {lowStockProducts.slice(0, 6).map((product) => (
            <div key={product.id} className="flex justify-between gap-4 border-t py-3 text-sm">
              <span className="truncate">{product.name}</span>
              <b className={(product.stockQuantity ?? 20) === 0 ? 'text-red-700' : 'text-brown'}>
                {(product.stockQuantity ?? 20) === 0
                  ? 'Нет в наличии'
                  : `${product.stockQuantity} шт.`}
              </b>
            </div>
          ))}
          {!lowStockProducts.length && (
            <p className="border-t py-4 text-sm text-green-700">
              Все товары имеют достаточный запас.
            </p>
          )}
        </div>
      </div>
      <Link href="/admin/analytics" className="admin-card mt-5 flex items-center justify-between group"><div><p className="eyebrow text-brown">Analytics</p><h2 className="display text-2xl mt-2">Подробная аналитика продаж</h2></div><TrendingUp className="group-hover:text-brown" /></Link>
      <div className="admin-card mt-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="display text-xl">Категории</h2>
          <span className="text-xs text-muted">{categories.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category.id} className="border px-3 py-2 text-xs bg-sand/50">
              {category.name} ·{' '}
              {products.filter((product) => product.category === category.slug).length}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
