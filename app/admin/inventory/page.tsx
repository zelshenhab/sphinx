'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Boxes } from 'lucide-react';
import { useCatalog } from '@/features/catalog';
import { listOrders } from '@/core/supabase/store';
import type { Order } from '@/types';

export default function InventoryPage() {
  const { products } = useCatalog();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { void listOrders().then(setOrders); }, []);
  const quantityFor = (productName: string, color: string, size: string, statuses: string[]) =>
    orders.filter((order) => statuses.includes(order.status)).flatMap((order) => order.lines)
      .filter((line) => line.productName === productName && line.color === color && line.size === size)
      .reduce((sum, line) => sum + line.quantity, 0);
  const rows = products.flatMap((product) =>
    product.colors.flatMap((color) =>
      product.sizes.map((size) => ({
        product,
        color,
        size,
        available:
          product.variantStock?.[`${color}::${size}`] ??
          product.sizeStock?.[size] ??
          product.stockQuantity ??
          0,
        reserved: quantityFor(product.name, color, size, ['new', 'contacted', 'confirmed']),
        sold: quantityFor(product.name, color, size, ['shipped', 'completed']),
      })),
    ),
  );
  const low = rows.filter((row) => row.available <= 5);
  return (
    <div className="space-y-5">
      <div className="admin-card flex flex-col sm:flex-row justify-between gap-4">
        <div><h2 className="display text-2xl">Управление складом</h2><p className="text-xs text-muted mt-2">Остатки по каждой комбинации цвета и размера.</p></div>
        <div className="flex gap-2"><span className="border px-4 py-2 text-xs">{rows.length} вариантов</span><span className="border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">{low.length} требуют внимания</span></div>
      </div>
      {low.length > 0 && <div className="admin-card border-gold/40 flex gap-3 text-sm"><AlertTriangle className="text-gold shrink-0" size={19} />Есть варианты с остатком 5 единиц или меньше.</div>}
      <div className="admin-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-xs text-muted text-left"><tr><th className="pb-3">Товар</th><th>Цвет</th><th>Размер</th><th>Доступно</th><th>Зарезервировано</th><th>Продано</th><th /></tr></thead>
          <tbody>{rows.map((row) => <tr key={`${row.product.id}-${row.color}-${row.size}`} className="border-t"><td className="py-3 font-medium">{row.product.name}</td><td>{row.color}</td><td>{row.size}</td><td><b className={row.available === 0 ? 'text-red-700' : row.available <= 5 ? 'text-brown' : 'text-green-700'}>{row.available}</b></td><td className="text-brown">{row.reserved}</td><td className="text-muted">{row.sold}</td><td><Link href="/admin/products" className="text-xs underline">Изменить</Link></td></tr>)}</tbody>
        </table>
        {!rows.length && <div className="py-14 text-center text-muted"><Boxes className="mx-auto mb-3" />Вариантов пока нет.</div>}
      </div>
    </div>
  );
}
