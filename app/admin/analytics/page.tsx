'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { getSalesReport, type SalesReport } from '@/core/supabase/store';
import { formatPrice } from '@/config/site';

export default function AnalyticsPage() {
  const [data, setData] = useState<SalesReport | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    void getSalesReport()
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить аналитику. Обновите страницу.');
      });
    return () => {
      active = false;
    };
  }, []);
  if (error)
    return (
      <p role="alert" className="admin-card text-red-700">
        {error}
      </p>
    );
  if (!data)
    return (
      <p role="status" className="admin-card">
        Загрузка…
      </p>
    );
  const max = Math.max(1, ...data.products.map(([, value]) => value));
  return (
    <div className="space-y-5">
      <div className="admin-card">
        <h2 className="display text-2xl">Аналитика продаж</h2>
        <p className="text-xs text-muted mt-2">Данные рассчитаны на основе заказов магазина.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Metric label="Стоимость доставленных заказов" value={formatPrice(data.revenue)} />
        <Metric label="Доставленных заказов" value={String(data.completed)} />
        <Metric
          label="Средний чек"
          value={formatPrice(data.completed ? Math.round(data.revenue / data.completed) : 0)}
        />
      </div>
      <div className="grid xl:grid-cols-2 gap-5">
        <div className="admin-card">
          <h3 className="display text-xl mb-5">Популярные товары</h3>
          {data.products.map(([name, value]) => (
            <div key={name} className="mb-4">
              <div className="flex justify-between text-xs gap-4">
                <span className="truncate">{name}</span>
                <b>{value}</b>
              </div>
              <div className="h-2 bg-sand mt-2">
                <div className="h-full bg-gold" style={{ width: `${(value / max) * 100}%` }} />
              </div>
            </div>
          ))}
          {!data.products.length && <Empty />}
        </div>
        <div className="admin-card grid sm:grid-cols-2 gap-6">
          <Ranking title="Цвета" rows={data.colors} />
          <Ranking title="Размеры" rows={data.sizes} />
        </div>
      </div>
      <div className="admin-card text-xs text-muted">
        <BarChart3 className="inline mr-2" size={15} />
        Просмотры, источники трафика и брошенные корзины потребуют подключения аналитического
        счётчика.
      </div>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card">
      <p className="text-xs text-muted">{label}</p>
      <b className="display text-3xl block mt-3">{value}</b>
    </div>
  );
}
function Ranking({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div>
      <h3 className="display text-xl mb-4">{title}</h3>
      {rows.map(([name, value]) => (
        <div key={name} className="flex justify-between border-t py-3 text-sm">
          <span>{name}</span>
          <b>{value}</b>
        </div>
      ))}
      {!rows.length && <Empty />}
    </div>
  );
}
function Empty() {
  return <p className="text-sm text-muted py-4">Недостаточно данных.</p>;
}
