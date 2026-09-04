'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid, ProductGridSkeleton, useCatalog } from '@/features/catalog';
import { useLanguage } from '@/features/i18n';
export default function Shop() {
  const { banners, categories, products, loading, settings } = useCatalog();
  const { language } = useLanguage();
  const [now] = useState(() => Date.now());
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('new');
  const [query, setQuery] = useState('');
  const [size, setSize] = useState('all');
  const [color, setColor] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const availableCategories = categories.filter((category) => category.active);
  const sizes = Array.from(
    new Set([
      ...(settings.sizes ?? '').split(',').map((item) => item.trim()),
      ...products.flatMap((product) => product.sizes),
    ]),
  ).filter(Boolean);
  const colors = Array.from(
    new Set([
      ...(settings.colors ?? '').split(',').map((item) => item.trim()),
      ...products.flatMap((product) => product.colors),
    ]),
  ).filter(Boolean);
  const productStock = (product: (typeof products)[number]) =>
    product.variantStock
      ? Object.values(product.variantStock).reduce((total, value) => total + value, 0)
      : (product.stockQuantity ?? 99);
  const variantAvailable = (product: (typeof products)[number]) => {
    if (color !== 'all' && !product.colors.includes(color)) return false;
    if (size !== 'all' && !product.sizes.includes(size)) return false;
    if (color !== 'all' && size !== 'all')
      return (
        (product.variantStock?.[`${color}::${size}`] ??
          product.sizeStock?.[size] ??
          product.stockQuantity ??
          99) > 0
      );
    if (size !== 'all')
      return product.colors.some(
        (candidateColor) =>
          (product.variantStock?.[`${candidateColor}::${size}`] ??
            product.sizeStock?.[size] ??
            product.stockQuantity ??
            99) > 0,
      );
    if (color !== 'all')
      return product.sizes.some(
        (candidateSize) =>
          (product.variantStock?.[`${color}::${candidateSize}`] ??
            product.sizeStock?.[candidateSize] ??
            product.stockQuantity ??
            99) > 0,
      );
    return true;
  };
  const banner = banners.find((item) => {
    const started = !item.startsAt || new Date(item.startsAt).getTime() <= now;
    const notEnded = !item.endsAt || new Date(item.endsAt).getTime() >= now;
    return item.active && item.location === 'shop' && started && notEnded;
  });
  const list = [...products]
    .filter((product) => availableCategories.some((category) => category.slug === product.category))
    .filter((p) => cat === 'all' || p.category === cat)
    .filter((product) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) return true;
      const categoryName = availableCategories.find(
        (category) => category.slug === product.category,
      )?.name;
      return [product.name, product.description, categoryName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    })
    .filter(variantAvailable)
    .filter((product) => !inStockOnly || productStock(product) > 0)
    .filter((product) => !minPrice || product.price >= Number(minPrice))
    .filter((product) => !maxPrice || product.price <= Number(maxPrice))
    .sort((a, b) =>
      sort === 'asc'
        ? a.price - b.price
        : sort === 'desc'
          ? b.price - a.price
          : Number(b.isNew) - Number(a.isNew),
    );
  const hasFilters =
    Boolean(query) ||
    cat !== 'all' ||
    size !== 'all' ||
    color !== 'all' ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    inStockOnly;
  const resetFilters = () => {
    setQuery('');
    setCat('all');
    setSize('all');
    setColor('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  };
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
      <section className="my-10 border-y py-5 border-black/10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field search-field"
            placeholder={language === 'en' ? 'Search products...' : 'Поиск товаров...'}
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-5 mb-3">
          <SlidersHorizontal size={16} />
          <b className="text-sm">{language === 'en' ? 'Filters' : 'Фильтры'}</b>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          <select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">{language === 'en' ? 'All categories' : 'Все категории'}</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select className="field" value={size} onChange={(event) => setSize(event.target.value)}>
            <option value="all">{language === 'en' ? 'All sizes' : 'Все размеры'}</option>
            {sizes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            className="field"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          >
            <option value="all">{language === 'en' ? 'All colors' : 'Все цвета'}</option>
            {colors.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <input
            className="field"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder={language === 'en' ? 'Min price' : 'Цена от'}
          />
          <input
            className="field"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder={language === 'en' ? 'Max price' : 'Цена до'}
          />
          <label className="field flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
            />
            {language === 'en' ? 'In stock' : 'В наличии'}
          </label>
          <select className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">{language === 'en' ? 'New arrivals' : 'Новинки'}</option>
            <option value="asc">
              {language === 'en' ? 'Price: Low to high' : 'Цена: по возрастанию'}
            </option>
            <option value="desc">
              {language === 'en' ? 'Price: High to low' : 'Цена: по убыванию'}
            </option>
          </select>
        </div>
        <div className="flex justify-between items-center gap-4 mt-5 text-sm">
          <p className="text-muted">
            {language === 'en'
              ? `${list.length} products found`
              : `Найдено товаров: ${list.length}`}
          </p>
          {hasFilters && (
            <button onClick={resetFilters} className="border-b border-ink">
              {language === 'en' ? 'Clear filters' : 'Сбросить фильтры'}
            </button>
          )}
        </div>
      </section>
      {loading ? (
        <ProductGridSkeleton />
      ) : list.length ? (
        <ProductGrid products={list} />
      ) : (
        <div className="py-20 text-center border border-black/10 bg-white">
          <p className="display text-2xl">
            {language === 'en' ? 'No products found' : 'Товары не найдены'}
          </p>
          <button onClick={resetFilters} className="btn btn-dark mt-6">
            {language === 'en' ? 'Clear filters' : 'Сбросить фильтры'}
          </button>
        </div>
      )}
    </main>
  );
}
