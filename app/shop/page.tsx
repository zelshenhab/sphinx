'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid2X2, Rows2, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid, ProductGridSkeleton, useCatalog } from '@/features/catalog';
import { useLanguage } from '@/features/i18n';
import { formatPrice, getColorSwatch } from '@/config/site';
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2);
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
  const highestPrice = Math.max(1, ...products.map((product) => product.price));
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
  const bannerTitle = language === 'en' && banner?.titleEn ? banner.titleEn : banner?.title;
  const bannerSubtitle =
    language === 'en' && banner?.subtitleEn ? banner.subtitleEn : banner?.subtitle;
  const bannerCta = language === 'en' && banner?.ctaTextEn ? banner.ctaTextEn : banner?.ctaText;
  const hasBannerContent = Boolean(bannerTitle || bannerSubtitle || bannerCta);
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
  useEffect(() => {
    if (!filtersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);
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
          {hasBannerContent && <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />}
          {hasBannerContent && (
            <div className="relative p-7 sm:p-10">
              {bannerSubtitle && <p className="eyebrow">{bannerSubtitle}</p>}
              {bannerTitle && <h2 className="display text-4xl sm:text-5xl mt-3">{bannerTitle}</h2>}
              {bannerCta && <Link href={banner.ctaUrl || '/shop'} className="btn btn-light mt-6">{bannerCta}</Link>}
            </div>
          )}
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
        <div className="hidden md:flex items-center gap-2 mt-5 mb-3">
          <SlidersHorizontal size={16} />
          <b className="text-sm">{language === 'en' ? 'Filters' : 'Фильтры'}</b>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="md:hidden btn border border-ink w-full mt-4 gap-2"
        >
          <SlidersHorizontal size={16} />
          {language === 'en' ? 'Open filters' : 'Открыть фильтры'}
        </button>
        <div className="hidden md:grid md:grid-cols-[220px_1fr_1fr] gap-5 items-start">
          <select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">{language === 'en' ? 'All categories' : 'Все категории'}</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <VisualFilters
            language={language}
            sizes={sizes}
            colors={colors}
            size={size}
            color={color}
            setSize={setSize}
            setColor={setColor}
          />
          <div className="border border-black/10 bg-white p-4">
            <div className="flex justify-between text-xs mb-3">
              <b>{language === 'en' ? 'Maximum price' : 'Максимальная цена'}</b>
              <span>{maxPrice ? formatPrice(Number(maxPrice)) : language === 'en' ? 'Any' : 'Любая'}</span>
            </div>
            <input
              className="w-full accent-black"
              type="range"
              min="0"
              max={highestPrice}
              step="100"
              value={maxPrice || highestPrice}
              onChange={(event) => setMaxPrice(event.target.value === String(highestPrice) ? '' : event.target.value)}
            />
          </div>
          <label className="field flex items-center gap-2 cursor-pointer text-sm md:col-start-1">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
            />
            {language === 'en' ? 'In stock' : 'В наличии'}
          </label>
        </div>
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {query && <FilterChip label={`“${query}”`} clear={() => setQuery('')} />}
            {cat !== 'all' && (
              <FilterChip
                label={availableCategories.find((item) => item.slug === cat)?.name ?? cat}
                clear={() => setCat('all')}
              />
            )}
            {size !== 'all' && <FilterChip label={size} clear={() => setSize('all')} />}
            {color !== 'all' && <FilterChip label={color} clear={() => setColor('all')} />}
            {(minPrice || maxPrice) && (
              <FilterChip
                label={`${minPrice || '0'}–${maxPrice || '∞'} ₽`}
                clear={() => {
                  setMinPrice('');
                  setMaxPrice('');
                }}
              />
            )}
            {inStockOnly && (
              <FilterChip
                label={language === 'en' ? 'In stock' : 'В наличии'}
                clear={() => setInStockOnly(false)}
              />
            )}
          </div>
        )}
        <div className="sticky top-16 sm:top-20 z-30 bg-ivory/95 backdrop-blur flex justify-between items-center gap-3 mt-5 py-3 text-sm">
          <p className="text-muted">
            {language === 'en'
              ? `${list.length} products found`
              : `Найдено товаров: ${list.length}`}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <select
              className="bg-transparent text-xs max-w-36"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="new">{language === 'en' ? 'Newest' : 'Новинки'}</option>
              <option value="asc">{language === 'en' ? 'Price ↑' : 'Цена ↑'}</option>
              <option value="desc">{language === 'en' ? 'Price ↓' : 'Цена ↓'}</option>
            </select>
            <div className="flex md:hidden border border-black/15">
              <button
                aria-label="One column"
                onClick={() => setMobileColumns(1)}
                className={`p-2 ${mobileColumns === 1 ? 'bg-ink text-white' : ''}`}
              >
                <Rows2 size={15} />
              </button>
              <button
                aria-label="Two columns"
                onClick={() => setMobileColumns(2)}
                className={`p-2 ${mobileColumns === 2 ? 'bg-ink text-white' : ''}`}
              >
                <Grid2X2 size={15} />
              </button>
            </div>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="hidden sm:block border-b border-ink whitespace-nowrap"
              >
                {language === 'en' ? 'Clear' : 'Сбросить'}
              </button>
            )}
          </div>
        </div>
      </section>
      <div
        className={`fixed inset-0 z-[90] md:hidden ${filtersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <button
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${filtersOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-auto bg-ivory rounded-t-3xl p-5 transition-transform duration-300 ${filtersOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="display text-2xl">{language === 'en' ? 'Filters' : 'Фильтры'}</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-11 h-11 grid place-items-center"
            >
              <X />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 py-5">
            <select
              className="field col-span-2"
              value={cat}
              onChange={(event) => setCat(event.target.value)}
            >
              <option value="all">{language === 'en' ? 'All categories' : 'Все категории'}</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="col-span-2">
              <VisualFilters
                language={language}
                sizes={sizes}
                colors={colors}
                size={size}
                color={color}
                setSize={setSize}
                setColor={setColor}
              />
            </div>
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
            <label className="field col-span-2 flex gap-3 items-center">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
              />
              {language === 'en' ? 'In stock only' : 'Только в наличии'}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={resetFilters} className="btn border border-ink">
              {language === 'en' ? 'Clear' : 'Сбросить'}
            </button>
            <button onClick={() => setFiltersOpen(false)} className="btn btn-dark">
              {language === 'en' ? `Show ${list.length}` : `Показать ${list.length}`}
            </button>
          </div>
        </aside>
      </div>
      {loading ? (
        <ProductGridSkeleton />
      ) : list.length ? (
        <ProductGrid products={list} mobileColumns={mobileColumns} />
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
function FilterChip({ label, clear }: { label: string; clear: () => void }) {
  return (
    <button
      onClick={clear}
      className="inline-flex items-center gap-1.5 bg-white border border-black/10 px-3 py-1.5 text-[10px]"
    >
      {label}
      <X size={12} />
    </button>
  );
}

function VisualFilters({
  language,
  sizes,
  colors,
  size,
  color,
  setSize,
  setColor,
}: {
  language: 'ru' | 'en';
  sizes: string[];
  colors: string[];
  size: string;
  color: string;
  setSize: (value: string) => void;
  setColor: (value: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-5 border border-black/10 bg-white p-4">
      <div>
        <b className="text-xs">{language === 'en' ? 'Size' : 'Размер'}</b>
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={() => setSize('all')} className={`min-w-10 h-9 px-2 text-[10px] border ${size === 'all' ? 'bg-ink text-white border-ink' : 'border-black/15'}`}>ALL</button>
          {sizes.map((item) => (
            <button key={item} onClick={() => setSize(item)} className={`min-w-10 h-9 px-2 text-[10px] border ${size === item ? 'bg-ink text-white border-ink' : 'border-black/15'}`}>{item}</button>
          ))}
        </div>
      </div>
      <div>
        <b className="text-xs">{language === 'en' ? 'Color' : 'Цвет'}</b>
        <div className="flex flex-wrap gap-3 mt-3">
          <button onClick={() => setColor('all')} className={`h-9 px-3 text-[10px] border ${color === 'all' ? 'bg-ink text-white border-ink' : 'border-black/15'}`}>ALL</button>
          {colors.map((item) => (
            <button key={item} title={item} aria-label={item} onClick={() => setColor(item)} className={`w-9 h-9 rounded-full border-2 p-1 ${color === item ? 'border-ink scale-110' : 'border-transparent'}`}>
              <span className="block w-full h-full rounded-full border border-black/20 shadow-sm" style={{ backgroundColor: getColorSwatch(item) }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
