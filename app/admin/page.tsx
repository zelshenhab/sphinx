'use client';
import Link from 'next/link';
import { useCatalog } from '@/features/catalog';
import { formatPrice } from '@/config/site';
import { AlertTriangle, ArrowUpRight, PackagePlus, ShoppingCart } from 'lucide-react';
export default function Admin() {
  const { products, categories, loading } = useCatalog();
  const lowStockProducts = products
    .filter((product) => (product.stockQuantity ?? 20) <= 10)
    .sort((a, b) => (a.stockQuantity ?? 20) - (b.stockQuantity ?? 20));
  const stats = [
    ['Всего товаров', products.length],
    ['Товаров в наличии', products.filter((p) => (p.stockQuantity ?? 20) > 0).length],
    ['Мало на складе', lowStockProducts.length],
    ['Товаров со скидкой', products.filter((p) => p.isSale).length],
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
            <PackagePlus size={16} /> Товары
          </Link>
          <Link href="/admin/orders" className="btn border border-white/30 text-white">
            <ShoppingCart size={16} /> Заказы
          </Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
            <h2 className="display text-2xl">Последние товары</h2>
            <Link href="/admin/products" className="text-xs underline flex items-center gap-1">
              Все <ArrowUpRight size={13} />
            </Link>
          </div>
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex justify-between gap-4 border-t py-3 text-sm">
              <span className="truncate">{p.name}</span>
              <b className="shrink-0">{formatPrice(p.price)}</b>
            </div>
          ))}
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
