'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductGrid, ProductGridSkeleton, useCatalog } from '@/features/catalog';
import { useLanguage } from '@/features/i18n';
export default function Shop() {
  const { banners, categories, products, loading } = useCatalog();
  const { language } = useLanguage();
  const [now] = useState(() => Date.now());
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('new');
  const banner = banners.find((item) => {
    const started = !item.startsAt || new Date(item.startsAt).getTime() <= now;
    const notEnded = !item.endsAt || new Date(item.endsAt).getTime() >= now;
    return item.active && item.location === 'shop' && started && notEnded;
  });
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
      {banner && (
        <section className="relative min-h-72 mb-14 overflow-hidden bg-ink text-white flex items-end">
          {banner.image && (
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority
              className={`object-cover ${banner.mobileImage ? 'hidden md:block' : ''}`}
            />
          )}
          {banner.mobileImage && (
            <Image
              src={banner.mobileImage}
              alt={banner.title}
              fill
              priority
              className="object-cover md:hidden"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />
          <div className="relative p-7 sm:p-10">
            <p className="eyebrow">
              {language === 'en' && banner.subtitleEn ? banner.subtitleEn : banner.subtitle}
            </p>
            <h2 className="display text-4xl sm:text-5xl mt-3">
              {language === 'en' && banner.titleEn ? banner.titleEn : banner.title}
            </h2>
            <Link href={banner.ctaUrl} className="btn btn-light mt-6">
              {language === 'en' && banner.ctaTextEn ? banner.ctaTextEn : banner.ctaText}
            </Link>
          </div>
        </section>
      )}
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
