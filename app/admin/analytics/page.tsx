'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { listOrders } from '@/core/supabase/store';
import { formatPrice } from '@/config/site';
import type { Order } from '@/types';

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { void listOrders().then(setOrders); }, []);
  const data = useMemo(() => {
    const completed = orders.filter((order) => order.status !== 'cancelled');
    const productSales = new Map<string, number>(); const colors = new Map<string, number>(); const sizes = new Map<string, number>();
    completed.flatMap((order) => order.lines).forEach((line) => { productSales.set(line.productName, (productSales.get(line.productName) ?? 0) + line.quantity); colors.set(line.color, (colors.get(line.color) ?? 0) + line.quantity); sizes.set(line.size, (sizes.get(line.size) ?? 0) + line.quantity); });
    const top = (map: Map<string, number>) => [...map].sort((a,b) => b[1]-a[1]).slice(0,5);
    return { completed, revenue: completed.reduce((sum, order) => sum + order.total, 0), products: top(productSales), colors: top(colors), sizes: top(sizes) };
  }, [orders]);
  const max = Math.max(1, ...data.products.map(([, value]) => value));
  return <div className="space-y-5"><div className="admin-card"><h2 className="display text-2xl">Аналитика продаж</h2><p className="text-xs text-muted mt-2">Данные рассчитаны на основе заказов магазина.</p></div><div className="grid sm:grid-cols-3 gap-4"><Metric label="Выручка" value={formatPrice(data.revenue)} /><Metric label="Заказов" value={String(data.completed.length)} /><Metric label="Средний чек" value={formatPrice(data.completed.length ? Math.round(data.revenue/data.completed.length) : 0)} /></div><div className="grid xl:grid-cols-2 gap-5"><div className="admin-card"><h3 className="display text-xl mb-5">Популярные товары</h3>{data.products.map(([name,value]) => <div key={name} className="mb-4"><div className="flex justify-between text-xs gap-4"><span className="truncate">{name}</span><b>{value}</b></div><div className="h-2 bg-sand mt-2"><div className="h-full bg-gold" style={{width:`${value/max*100}%`}} /></div></div>)}{!data.products.length && <Empty />}</div><div className="admin-card grid sm:grid-cols-2 gap-6"><Ranking title="Цвета" rows={data.colors} /><Ranking title="Размеры" rows={data.sizes} /></div></div><div className="admin-card text-xs text-muted"><BarChart3 className="inline mr-2" size={15} />Просмотры, источники трафика и брошенные корзины потребуют подключения аналитического счётчика.</div></div>;
}
function Metric({label,value}:{label:string;value:string}) { return <div className="admin-card"><p className="text-xs text-muted">{label}</p><b className="display text-3xl block mt-3">{value}</b></div>; }
function Ranking({title,rows}:{title:string;rows:[string,number][]}) { return <div><h3 className="display text-xl mb-4">{title}</h3>{rows.map(([name,value]) => <div key={name} className="flex justify-between border-t py-3 text-sm"><span>{name}</span><b>{value}</b></div>)}{!rows.length && <Empty />}</div>; }
function Empty(){return <p className="text-sm text-muted py-4">Недостаточно данных.</p>;}
