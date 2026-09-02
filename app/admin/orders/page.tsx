'use client';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/config/site';
import { listOrders, updateOrderStatus } from '@/core/supabase/store';
import type { Order } from '@/types';
export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    void listOrders()
      .then(setOrders)
      .catch((loadError) => {
        console.error('[SPHINX_ORDERS_LOAD_ERROR]', loadError);
        setError('Не удалось загрузить заказы из Supabase.');
      });
  }, []);
  return (
    <div className="admin-card overflow-auto">
      <h2 className="display text-2xl mb-6">Заказы</h2>
      {error && <p className="text-sm text-red-700 mb-5">{error}</p>}
      <table className="w-full text-sm text-left min-w-[650px]">
        <thead>
          <tr>
            {['Order #', 'Customer', 'Items', 'Total', 'Date', 'Status'].map((x) => (
              <th className="py-3 text-muted" key={x}>
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr className="border-t" key={o.id}>
              <td className="py-4">{o.id}</td>
              <td className="py-4">{o.customer}</td>
              <td className="py-4">{o.items}</td>
              <td className="py-4">{formatPrice(o.total)}</td>
              <td className="py-4">{o.date}</td>
              <td className="py-4">
                <select
                  className="field"
                  value={o.status}
                  onChange={async (event) => {
                    const status = event.target.value;
                    if (o.databaseId) await updateOrderStatus(o.databaseId, status);
                    setOrders((current) =>
                      current.map((item) => (item.id === o.id ? { ...item, status } : item)),
                    );
                  }}
                >
                  {['new', 'contacted', 'confirmed', 'shipped', 'completed', 'cancelled'].map(
                    (status) => (
                      <option key={status}>{status}</option>
                    ),
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
