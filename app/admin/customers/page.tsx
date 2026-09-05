'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { listOrders } from '@/core/supabase/store';
import { formatPrice } from '@/config/site';
import type { Order } from '@/types';

export default function CustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => { void listOrders().then(setOrders); }, []);
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; telegram?: string; orders: number; total: number; last: string; colors: string[]; sizes: string[] }>();
    orders.forEach((order) => {
      const key = order.phone.replace(/\D/g, '') || order.phone;
      const current = map.get(key) ?? { name: order.customer, phone: order.phone, telegram: order.telegram, orders: 0, total: 0, last: order.date, colors: [], sizes: [] };
      current.orders += 1; current.total += order.total;
      current.colors.push(...order.lines.map((line) => line.color)); current.sizes.push(...order.lines.map((line) => line.size));
      map.set(key, current);
    });
    return [...map.values()].filter((customer) => `${customer.name} ${customer.phone} ${customer.telegram ?? ''}`.toLowerCase().includes(query.toLowerCase()));
  }, [orders, query]);
  const favorite = (values: string[]) => values.sort((a, b) => values.filter((x) => x === b).length - values.filter((x) => x === a).length)[0] ?? '—';
  return <div className="space-y-5"><div className="admin-card"><div className="flex flex-col sm:flex-row justify-between gap-4"><div><h2 className="display text-2xl">Клиенты</h2><p className="text-xs text-muted mt-2">Профили создаются автоматически из заказов.</p></div><label className="relative sm:w-80"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input className="field search-field" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Имя, телефон, Telegram" /></label></div></div><div className="grid lg:grid-cols-2 gap-4">{customers.map((customer) => { const level = customer.total >= 30000 ? 'VIP' : customer.orders > 1 ? 'Повторный' : 'Новый'; return <article key={customer.phone} className="admin-card"><div className="flex justify-between gap-3"><div><h3 className="font-semibold">{customer.name}</h3><a href={`tel:${customer.phone}`} className="text-xs text-muted">{customer.phone}</a></div><span className="h-fit bg-sand px-3 py-1 text-[10px] uppercase">{level}</span></div><div className="grid grid-cols-3 gap-2 mt-5 text-center"><Fact label="Заказов" value={String(customer.orders)} /><Fact label="Потрачено" value={formatPrice(customer.total)} /><Fact label="Последний" value={customer.last} /></div><p className="text-xs text-muted mt-4">Любимые: {favorite(customer.colors)} · {favorite(customer.sizes)}</p>{customer.telegram && <a href={`https://t.me/${customer.telegram.replace('@','')}`} target="_blank" className="btn border border-ink mt-4">Открыть Telegram</a>}</article>; })}</div>{!customers.length && <div className="admin-card text-center py-14 text-muted"><Users className="mx-auto mb-3" />Клиентов пока нет.</div>}</div>;
}
function Fact({ label, value }: { label: string; value: string }) { return <div className="bg-sand/50 p-3 min-w-0"><span className="block text-[9px] uppercase text-muted">{label}</span><b className="block text-xs mt-2 truncate">{value}</b></div>; }
