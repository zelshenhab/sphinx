'use client';
import { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { ProductGrid, useCatalog } from '@/features/catalog';
import { formatPrice, getColorSwatch, TELEGRAM_USERNAME } from '@/config/site';
import { useCart } from '@/features/cart';
import type { Product } from '@/types';
import { useLanguage } from '@/features/i18n';
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { categories, products, loading } = useCatalog();
  const p = products.find((x) => x.slug === slug);
  if (loading)
    return (
      <main className="container-x py-8 grid lg:grid-cols-2 gap-10" aria-label="Loading product">
        <div className="aspect-[4/5] skeleton-shimmer" />
        <div className="space-y-5 pt-6">
          <div className="h-3 w-24 skeleton-shimmer" />
          <div className="h-10 w-4/5 skeleton-shimmer" />
          <div className="h-5 w-32 skeleton-shimmer" />
          <div className="h-24 w-full skeleton-shimmer" />
          <div className="h-12 w-full skeleton-shimmer" />
        </div>
      </main>
    );
  if (!p || !categories.some((category) => category.slug === p.category && category.active))
    notFound();
  return (
    <ProductDetails
      key={`${p.id}-${p.images[0]}-${p.colors.join('|')}-${JSON.stringify(p.colorImages ?? {})}`}
      product={p}
    />
  );
}
function ProductDetails({ product: p }: { product: Product }) {
  const stockForVariant = (candidateColor: string, candidateSize: string) =>
    p.variantStock?.[`${candidateColor}::${candidateSize}`] ??
    p.sizeStock?.[candidateSize] ??
    (p.sizes.includes(candidateSize) ? (p.stockQuantity ?? 99) : 0);
  const totalStock = p.variantStock
    ? Object.values(p.variantStock).reduce((total, stock) => total + stock, 0)
    : p.sizeStock
      ? Object.values(p.sizeStock).reduce((total, stock) => total + stock, 0)
      : (p.stockQuantity ?? 99);
  const discountPercent =
    p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const hasColorGalleries = Object.values(p.colorImages ?? {}).some((images) => images.length > 0);
  const isColorAvailable = (candidate: string) =>
    p.colors.includes(candidate) &&
    (!hasColorGalleries || (p.colorImages?.[candidate]?.length ?? 0) > 0) &&
    p.sizes.some((candidateSize) => stockForVariant(candidate, candidateSize) > 0);
  const defaultColor = p.colors.find(isColorAvailable) ?? p.colors.find(Boolean) ?? '';
  const [color, setColor] = useState(defaultColor);
  const [size, setSize] = useState(
    p.sizes.find((candidate) => stockForVariant(defaultColor, candidate) > 0) ?? '',
  );
  const [q, setQ] = useState(1);
  const [image, setImage] = useState(p.colorImages?.[defaultColor]?.[0] || p.images[0]);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const ignoreGalleryClick = useRef(false);
  const purchaseActionsRef = useRef<HTMLDivElement>(null);
  const [purchaseActionsVisible, setPurchaseActionsVisible] = useState(false);
  const { add } = useCart();
  const { categories, products, settings } = useCatalog();
  const { language } = useLanguage();
  const tr = (ru: string, en: string) => (language === 'en' ? en : ru);
  const selectedVariantStock = size ? stockForVariant(color, size) : 0;
  const relatedProducts = products
    .filter(
      (product) =>
        product.id !== p.id &&
        product.stockQuantity !== 0 &&
        categories.some((category) => category.slug === product.category && category.active),
    )
    .sort((a, b) => {
      const score = (product: Product) =>
        Number(product.category === p.category) * 10 +
        Number(product.type === p.type) * 4 +
        product.colors.filter((candidate) => p.colors.includes(candidate)).length;
      return score(b) - score(a);
    })
    .slice(0, 4);
  const allColors = Array.from(
    new Set([
      ...(settings.colors || p.colors.join(','))
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      ...p.colors,
    ]),
  );
  const allSizes = Array.from(
    new Set([
      ...(settings.sizes || p.sizes.join(','))
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      ...p.sizes,
    ]),
  );
  const currentImages = color && p.colorImages?.[color]?.length ? p.colorImages[color] : p.images;
  const displayedImage = currentImages.includes(image) ? image : currentImages[0];
  const currentImageIndex = Math.max(0, currentImages.indexOf(displayedImage));
  const navigateImage = (direction: number) => {
    if (currentImages.length < 2) return;
    const nextIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
    setImage(currentImages[nextIndex]);
  };
  const startSwipe = (clientX: number) => {
    touchStartX.current = clientX;
    ignoreGalleryClick.current = false;
  };
  const endSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 45) return;
    ignoreGalleryClick.current = true;
    navigateImage(distance > 0 ? -1 : 1);
  };
  const selectColor = (nextColor: string) => {
    setColor(nextColor);
    setImage(p.colorImages?.[nextColor]?.[0] || p.images[0]);
    const nextSize = p.sizes.find((candidate) => stockForVariant(nextColor, candidate) > 0) ?? '';
    setSize(nextSize);
    setQ(1);
  };
  useEffect(() => {
    const element = purchaseActionsRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPurchaseActionsVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <main className="container-x py-6 sm:py-10 pb-28 lg:pb-10 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)] gap-8 sm:gap-12 lg:gap-16">
        <div className="grid md:grid-cols-[96px_minmax(0,1fr)] gap-3 items-start -mx-5 sm:mx-0">
          <div
            onClick={() => {
              if (!ignoreGalleryClick.current) setZoomed(true);
              ignoreGalleryClick.current = false;
            }}
            onTouchStart={(event) => startSwipe(event.touches[0].clientX)}
            onTouchEnd={(event) => endSwipe(event.changedTouches[0].clientX)}
            className="relative aspect-[4/5] bg-sand overflow-hidden group/gallery md:col-start-2 md:row-start-1 cursor-zoom-in"
          >
            <Image
              key={displayedImage}
              src={displayedImage}
              alt={p.name}
              fill
              priority
              className="object-cover product-gallery-image"
            />
            {discountPercent > 0 && (
              <span className="absolute z-10 top-3 left-3 bg-red-700 text-white px-3 py-1.5 text-[10px] tracking-wider">
                {tr('СКИДКА', 'SALE')} −{discountPercent}%
              </span>
            )}
            {currentImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigateImage(-1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center bg-white/85 backdrop-blur opacity-100 md:opacity-0 md:group-hover/gallery:opacity-100 focus:opacity-100 hover:bg-white"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigateImage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center bg-white/85 backdrop-blur opacity-100 md:opacity-0 md:group-hover/gallery:opacity-100 focus:opacity-100 hover:bg-white"
                >
                  <ChevronRight size={19} />
                </button>
                <span className="absolute bottom-3 right-3 bg-black/55 text-white px-2.5 py-1 text-[10px] tracking-widest">
                  {currentImageIndex + 1} / {currentImages.length}
                </span>
                <span className="absolute bottom-3 left-3 bg-white/80 px-2.5 py-1 text-[9px] tracking-wider md:hidden">
                  {tr('Смахните для просмотра', 'Swipe to browse')}
                </span>
              </>
            )}
          </div>
          <div className="flex md:flex-col gap-3 md:col-start-1 md:row-start-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {currentImages.map((x) => (
              <button
                key={x}
                onClick={() => setImage(x)}
                className={`relative w-20 md:w-full shrink-0 aspect-[4/5] bg-sand overflow-hidden transition-all duration-300 ${displayedImage === x ? 'ring-2 ring-ink ring-offset-2 opacity-100' : 'opacity-55 hover:opacity-100'}`}
              >
                <Image
                  src={x}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-28 self-start">
          <p className="eyebrow text-brown">{p.type}</p>
          <h1 className="display text-3xl sm:text-4xl mt-4">SPHINX — {p.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-5">
            <b className={discountPercent > 0 ? 'text-2xl text-red-700' : 'text-xl'}>
              {formatPrice(p.price)}
            </b>
            {p.oldPrice && p.oldPrice > p.price && (
              <s className="text-base text-muted">{formatPrice(p.oldPrice)}</s>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-700 text-white px-2.5 py-1 text-[10px] tracking-wider">
                {tr('ВЫГОДА', 'SAVE')} {discountPercent}%
              </span>
            )}
          </div>
          {totalStock === 0 ? (
            <p className="text-sm text-red-700 mt-3">
              {language === 'en' ? 'Out of stock' : 'Нет в наличии'}
            </p>
          ) : totalStock <= 10 ? (
            <p className="text-sm text-amber-700 mt-3">
              {language === 'en' ? `Only ${totalStock} left` : `Осталось всего ${totalStock} шт.`}
            </p>
          ) : null}
          <p className="text-muted leading-7 mt-7">{p.description}</p>
          <div className="mt-9">
            <b className="text-sm">
              {tr('Цвет', 'Color')}: {color}
            </b>
            <div className="flex flex-wrap gap-2 mt-3">
              {allColors.map((c) => {
                const available = isColorAvailable(c);
                return (
                  <button
                    disabled={!available}
                    onClick={() => selectColor(c)}
                    key={c}
                    title={available ? c : `${c} — ${tr('недоступен', 'unavailable')}`}
                    className={`relative flex items-center gap-2 px-5 py-3 text-xs border active:scale-95 ${color === c && available ? 'border-ink bg-ink text-white' : 'border-black/15'} ${available ? '' : 'cursor-not-allowed opacity-40 line-through bg-black/5'}`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: getColorSwatch(c) }}
                    />
                    {c}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted mt-2">
              {tr(
                'Зачёркнутые цвета сейчас недоступны',
                'Crossed-out colors are currently unavailable',
              )}
            </p>
          </div>
          <div className="mt-7">
            <b className="text-sm">
              {tr('Размер', 'Size')}: {size}
            </b>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
              {allSizes.map((s) => {
                const remaining = stockForVariant(color, s);
                const available = p.sizes.includes(s) && remaining > 0;
                return (
                  <button
                    disabled={!available}
                    onClick={() => {
                      setSize(s);
                      setQ((current) => Math.min(current, remaining));
                    }}
                    key={s}
                    title={
                      available
                        ? `${s} — ${tr(`осталось ${remaining}`, `${remaining} left`)}`
                        : `${s} — ${tr('недоступен', 'unavailable')}`
                    }
                    className={`relative py-4 text-xs border transition-transform active:scale-95 ${size === s && available ? 'bg-ink text-white' : 'border-black/15'} ${available ? '' : 'cursor-not-allowed opacity-35 line-through bg-black/5'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {size && selectedVariantStock > 0 && (
              <p
                key={`${color}-${size}-${selectedVariantStock}`}
                className="text-sm text-amber-700 mt-3 stock-count-change"
              >
                {language === 'en'
                  ? `Only ${selectedVariantStock} left: ${color} / ${size}`
                  : `Осталось ${selectedVariantStock} шт.: ${color} / ${size}`}
              </p>
            )}
            <p className="text-[11px] text-muted mt-2">
              {tr(
                'Зачёркнутые размеры сейчас недоступны',
                'Crossed-out sizes are currently unavailable',
              )}
            </p>
            <details className="mt-4 border border-black/10 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium">
                {tr('Таблица размеров', 'Size guide')}
              </summary>
              <p className="text-[11px] text-muted mt-3">
                {tr(
                  'Измерения указаны в сантиметрах. Для свободной посадки сравните их с любимой футболкой.',
                  'Measurements are in centimeters. For a relaxed fit, compare them with your favorite T-shirt.',
                )}
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-xs text-center min-w-[420px]">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">{tr('Размер', 'Size')}</th>
                      <th>{tr('Грудь, см', 'Chest, cm')}</th>
                      <th>{tr('Длина, см', 'Length, cm')}</th>
                      <th>{tr('Рукав, см', 'Sleeve, cm')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['XS', '50', '66', '20'],
                      ['S', '53', '68', '21'],
                      ['M', '56', '71', '22'],
                      ['L', '59', '73', '23'],
                      ['XL', '62', '75', '24'],
                      ['XXL', '65', '77', '25'],
                    ].map((row) => (
                      <tr
                        className={`border-t ${size === row[0] ? 'bg-sand/70 font-medium' : ''}`}
                        key={row[0]}
                      >
                        {row.map((cell, index) => (
                          <td
                            className={`p-2 ${index === 0 ? 'text-left font-medium' : ''}`}
                            key={cell}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
          <div ref={purchaseActionsRef} className="flex flex-col sm:flex-row gap-3 mt-7">
            <div className="flex border border-black/20 items-center justify-between gap-4 px-4 h-12 sm:h-auto sm:min-w-32">
              <button onClick={() => setQ(Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              {q}
              <button onClick={() => setQ(Math.min(q + 1, selectedVariantStock))}>
                <Plus size={14} />
              </button>
            </div>
            <button
              disabled={totalStock === 0 || selectedVariantStock === 0}
              onClick={() => add(p, color, size, q)}
              className="btn btn-dark flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {totalStock === 0 || selectedVariantStock === 0
                ? tr('Нет в наличии', 'Out of stock')
                : tr('Добавить в корзину', 'Add to cart')}
            </button>
          </div>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            className="btn border border-ink w-full mt-3"
          >
            {tr('Заказать в Telegram', 'Order via Telegram')}
          </a>
          <div className="grid grid-cols-3 border-y border-black/10 mt-6 py-4 text-center divide-x divide-black/10">
            <div className="px-2">
              <b className="block text-[10px] uppercase tracking-wider">Premium</b>
              <span className="text-[9px] text-muted mt-1 block">
                {tr('Плотная ткань', 'Heavy fabric')}
              </span>
            </div>
            <div className="px-2">
              <b className="block text-[10px] uppercase tracking-wider">Telegram</b>
              <span className="text-[9px] text-muted mt-1 block">
                {tr('Прямой заказ', 'Direct order')}
              </span>
            </div>
            <div className="px-2">
              <b className="block text-[10px] uppercase tracking-wider">
                {tr('Возврат', 'Returns')}
              </b>
              <span className="text-[9px] text-muted mt-1 block">
                {tr('Обмен и возврат', 'Exchange & return')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-10">
            <ProductFact label={tr('Состав', 'Material')} value={p.material} />
            <ProductFact label={tr('Плотность', 'Weight')} value={p.gsm || '—'} />
            <ProductFact label={tr('Посадка', 'Fit')} value={p.fit} />
          </div>
          <div className="mt-5 border-t text-sm">
            <Info n={tr('Описание', 'Description')} v={p.description} />
          </div>
        </div>
      </main>
      {zoomed && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 p-4 md:p-10 grid place-items-center"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            aria-label="Close image"
            className="absolute z-20 top-4 right-4 md:top-5 md:right-5 w-12 h-12 rounded-full bg-black/60 text-white grid place-items-center touch-manipulation"
            onClick={(event) => {
              event.stopPropagation();
              setZoomed(false);
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              setZoomed(false);
            }}
          >
            <X />
          </button>
          <div
            className="relative w-full h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => startSwipe(event.touches[0].clientX)}
            onTouchEnd={(event) => endSwipe(event.changedTouches[0].clientX)}
          >
            <Image
              src={displayedImage}
              alt={p.name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
      {relatedProducts.length > 0 && (
        <section className="container-x pt-10 pb-24 border-t border-black/10">
          <p className="eyebrow text-brown">{tr('Рекомендуем', 'Recommended')}</p>
          <h2 className="display text-4xl mt-3 mb-10">
            {language === 'en' ? 'You may also like' : 'Вам также может понравиться'}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-ivory/95 backdrop-blur border-t border-black/10 p-3 flex items-center gap-4 lg:hidden transition-transform duration-300 ${purchaseActionsVisible ? 'translate-y-full pointer-events-none' : 'translate-y-0'}`}
      >
        <div className="min-w-0">
          <p className="text-[10px] text-muted truncate">
            {color} / {size || '—'}
          </p>
          <b className="text-sm">{formatPrice(p.price * q)}</b>
        </div>
        <button
          disabled={totalStock === 0 || selectedVariantStock === 0}
          onClick={() => add(p, color, size, q)}
          className="btn btn-dark flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {totalStock === 0 || selectedVariantStock === 0
            ? tr('Нет в наличии', 'Out of stock')
            : tr('Добавить в корзину', 'Add to cart')}
        </button>
      </div>
    </>
  );
}
function ProductFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-white p-3 min-w-0">
      <span className="block text-[9px] uppercase tracking-wider text-muted">{label}</span>
      <b className="block text-xs mt-2 break-words">{value}</b>
    </div>
  );
}
function Info({ n, v }: { n: string; v: string }) {
  return (
    <details className="border-b py-4">
      <summary className="cursor-pointer font-medium">{n}</summary>
      <p className="text-muted mt-3 leading-6">{v}</p>
    </details>
  );
}
