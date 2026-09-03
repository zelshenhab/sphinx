'use client';
import { useMemo, useState } from 'react';
import { ProductGrid, ProductGridSkeleton, useCatalog } from '@/features/catalog';
export default function Shop() {
  const { categories, products, loading } = useCatalog();
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('new');
  const list = useMemo(
    () =>
      [...products]
        .filter((product) =>
          categories.some((category) => category.slug === product.category && category.active),
        )
        .filter((p) => cat === 'all' || p.category === cat)
        .sort((a, b) =>
          sort === 'asc'
            ? a.price - b.price
            : sort === 'desc'
              ? b.price - a.price
              : Number(b.isNew) - Number(a.isNew),
        ),
    [cat, categories, products, sort],
  );
  return (
    <main className="container-x py-16">
      <p className="eyebrow text-brown">SPHINX Store</p>
      <h1 className="display text-5xl mt-3">Магазин</h1>
      <div className="flex flex-wrap justify-between gap-4 my-10 border-y py-5 border-black/10">
        <select className="bg-transparent" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">Все категории</option>
          {categories
            .filter((category) => category.active)
            .map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
        </select>
        <div className="flex gap-5 text-sm text-muted">
          <span>Размер: Все</span>
          <span>Цвет: Все</span>
          <span>Цена: Все</span>
        </div>
        <select className="bg-transparent" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Новинки</option>
          <option value="asc">Цена: по возрастанию</option>
          <option value="desc">Цена: по убыванию</option>
        </select>
      </div>
      {loading ? <ProductGridSkeleton /> : <ProductGrid products={list} />}
    </main>
  );
}
