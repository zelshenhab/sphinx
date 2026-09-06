'use client';

import { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { getCustomerPage, type CustomerReport } from '@/core/supabase/store';
import { Pagination } from '@/features/admin/components/pagination';
import { formatPrice } from '@/config/site';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerReport[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      void getCustomerPage(query, page)
        .then((result) => {
          if (active) {
            setCustomers(result.rows);
            setTotal(result.total);
          }
        })
        .catch(() => {
          if (active) setError('Не удалось загрузить клиентов. Обновите страницу.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, page]);
  return (
    <div className="space-y-5">
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="display text-2xl">Клиенты</h2>
            <p className="text-xs text-muted mt-2">Профили создаются автоматически из заказов.</p>
          </div>
          <label className="relative sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="field search-field"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
                setLoading(true);
              }}
              placeholder="Имя, телефон, Telegram"
            />
          </label>
        </div>
      </div>
      {error && (
        <p role="alert" className="admin-card text-red-700">
          {error}
        </p>
      )}
      {loading && <p role="status">Загрузка…</p>}
      <div className="grid lg:grid-cols-2 gap-4">
        {!loading &&
          !error &&
          customers.map((customer) => {
            const level =
              customer.total >= 30000 ? 'VIP' : customer.orders > 1 ? 'Повторный' : 'Новый';
            return (
              <article key={customer.phone} className="admin-card">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <a href={`tel:${customer.phone}`} className="text-xs text-muted">
                      {customer.phone}
                    </a>
                  </div>
                  <span className="h-fit bg-sand px-3 py-1 text-[10px] uppercase">{level}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                  <Fact label="Заказов" value={String(customer.orders)} />
                  <Fact label="Доставлено на сумму" value={formatPrice(customer.total)} />
                  <Fact
                    label="Последний"
                    value={new Date(customer.last).toLocaleDateString('ru-RU')}
                  />
                </div>
                <p className="text-xs text-muted mt-4">
                  Любимые: {customer.color ?? '—'} · {customer.size ?? '—'}
                </p>
                {customer.telegram && (
                  <a
                    href={`https://t.me/${customer.telegram.replace('@', '')}`}
                    target="_blank"
                    className="btn border border-ink mt-4"
                  >
                    Открыть Telegram
                  </a>
                )}
              </article>
            );
          })}
      </div>
      {!customers.length && !loading && !error && (
        <div className="admin-card text-center py-14 text-muted">
          <Users className="mx-auto mb-3" />
          Клиентов пока нет.
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
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sand/50 p-3 min-w-0">
      <span className="block text-[9px] uppercase text-muted">{label}</span>
      <b className="block text-xs mt-2 truncate">{value}</b>
    </div>
  );
}
