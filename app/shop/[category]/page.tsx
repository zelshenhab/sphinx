'use client';
import { LocalizedText } from '@/features/i18n';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <main className="container-x py-8 sm:py-14 min-h-[70svh]">
        <Link href="/shop" className="text-xs text-muted hover:text-ink transition-colors">
          ← <LocalizedText>{'Вернуться в магазин'}</LocalizedText>
        </Link>
        <section className="relative mt-6 sm:mt-8 min-h-[64svh] overflow-hidden bg-ink text-white grid place-items-center text-center">
          {c.image?.trim() ? (
            <Image
              src={c.image}
              alt={c.name}
              fill
              className="object-cover scale-110 blur-2xl brightness-[.38]"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#827565,transparent_60%)] opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/75" />
          <div className="relative z-10 max-w-2xl px-6 py-16">
            <span className="inline-flex items-center gap-2 border border-gold/60 bg-black/25 px-4 py-2 text-[10px] uppercase tracking-[.22em] text-gold">
              <i className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <LocalizedText>{'Скоро в продаже'}</LocalizedText>
            </span>
            <p className="eyebrow text-white/65 mt-8">
              <LocalizedText>{'Коллекция'}</LocalizedText>
            </p>
            <h1 className="display text-5xl sm:text-7xl mt-4 tracking-wide">
              <LocalizedText>{c.name}</LocalizedText>
            </h1>
            <p className="text-white/75 leading-7 mt-6 max-w-lg mx-auto">
              <LocalizedText>
                {'Эта коллекция сейчас недоступна. Мы уже готовим её и скоро добавим товары.'}
              </LocalizedText>
            </p>
            <Link href="/shop" className="btn btn-light mt-9">
              <LocalizedText>{'Смотреть доступные товары'}</LocalizedText>
            </Link>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main className="container-x py-16">
      <p className="eyebrow text-brown">
        <LocalizedText>{'Коллекция'}</LocalizedText>
      </p>
      <h1 className="display text-5xl mt-3 mb-12">
        <LocalizedText>{c.name}</LocalizedText>
      </h1>
      <CategoryProductGrid category={category} />
    </main>
  );
}
