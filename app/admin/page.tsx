'use client';
import { useCatalog } from '@/features/catalog';
import { formatPrice } from '@/config/site';
export default function Admin() {
  const { products, categories } = useCatalog();
  const stats = [
    ['Всего товаров', products.length],
    ['Активные товары', products.length],
    ['Категории', categories.length],
    ['Товаров со скидкой', products.filter((p) => p.isSale).length],
  ];
  return (
    <>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((x) => (
          <div className="admin-card" key={x[0]}>
            <p className="text-xs text-muted">{x[0]}</p>
            <b className="display text-4xl block mt-4">{x[1]}</b>
          </div>
        ))}
      </div>
      <div className="grid xl:grid-cols-2 gap-5 mt-5">
        <div className="admin-card">
          <h2 className="display text-2xl mb-5">Последние товары</h2>
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex justify-between border-t py-3 text-sm">
              <span>{p.name}</span>
              <b>{formatPrice(p.price)}</b>
            </div>
          ))}
        </div>
        <div className="admin-card">
          <h2 className="display text-2xl mb-5">Категории</h2>
          {categories.map((c) => (
            <div key={c.id} className="flex justify-between border-t py-3 text-sm">
              <span>{c.name}</span>
              <span className="text-muted">{c.active ? 'Active' : 'Hidden'}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
