'use client';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryProductGrid, useCatalog } from '@/features/catalog';
export default function Category({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { categories, loading } = useCatalog();
  const c = categories.find((x) => x.slug === category);
  if (loading) return <main className="container-x py-16 text-muted">Loading...</main>;
  if (!c) notFound();
  if (!c.active || !c.image?.trim()) {
    return (
      <main className="container-x py-20 min-h-[65vh] grid place-items-center text-center">
        <div className="max-w-xl">
          <p className="eyebrow text-brown">{c.name}</p>
          <h1 className="display text-5xl md:text-6xl mt-5">Скоро в продаже</h1>
          <p className="text-muted leading-7 mt-5">
            Эта коллекция сейчас недоступна. Мы уже готовим её и скоро добавим товары.
          </p>
          <Link href="/shop" className="btn btn-dark mt-8">
            Смотреть доступные товары
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="container-x py-16">
      <p className="eyebrow text-brown">Коллекция</p>
      <h1 className="display text-5xl mt-3 mb-12">{c.name}</h1>
      <CategoryProductGrid category={category} />
    </main>
  );
}
