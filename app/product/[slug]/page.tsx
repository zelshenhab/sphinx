'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { ProductGrid, useCatalog } from '@/features/catalog';
import { formatPrice, TELEGRAM_USERNAME } from '@/config/site';
import { useCart } from '@/features/cart';
import type { Product } from '@/types';
import { useLanguage } from '@/features/i18n';
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { categories, products, loading } = useCatalog();
  const p = products.find((x) => x.slug === slug);
  if (loading) return <main className="container-x py-20 text-muted">Loading...</main>;
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
  const { add } = useCart();
  const { categories, products, settings } = useCatalog();
  const { language } = useLanguage();
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
  const selectColor = (nextColor: string) => {
    setColor(nextColor);
    setImage(p.colorImages?.[nextColor]?.[0] || p.images[0]);
    const nextSize = p.sizes.find((candidate) => stockForVariant(nextColor, candidate) > 0) ?? '';
    setSize(nextSize);
    setQ(1);
  };
  return (
    <>
      <main className="container-x py-6 sm:py-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
        <div className="grid md:grid-cols-[96px_minmax(0,1fr)] gap-3 items-start">
          <div
            onClick={() => setZoomed(true)}
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
          <p className="text-xl mt-5">{formatPrice(p.price)}</p>
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
            <b className="text-sm">Цвет: {color}</b>
            <div className="flex flex-wrap gap-2 mt-3">
              {allColors.map((c) => {
                const available = isColorAvailable(c);
                return (
                  <button
                    disabled={!available}
                    onClick={() => selectColor(c)}
                    key={c}
                    title={available ? c : `${c} — недоступен`}
                    className={`relative flex items-center gap-2 px-4 py-2 text-xs border ${color === c && available ? 'border-ink bg-ink text-white' : 'border-black/15'} ${available ? '' : 'cursor-not-allowed opacity-40 line-through bg-black/5'}`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.toLowerCase() }}
                    />
                    {c}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted mt-2">Зачёркнутые цвета сейчас недоступны</p>
          </div>
          <div className="mt-7">
            <b className="text-sm">Размер: {size}</b>
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
                    title={available ? `${s} — осталось ${remaining}` : `${s} — недоступен`}
                    className={`relative py-3 text-xs border ${size === s && available ? 'bg-ink text-white' : 'border-black/15'} ${available ? '' : 'cursor-not-allowed opacity-35 line-through bg-black/5'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {size && selectedVariantStock > 0 && (
              <p className="text-sm text-amber-700 mt-3">
                {language === 'en'
                  ? `Only ${selectedVariantStock} left: ${color} / ${size}`
                  : `Осталось ${selectedVariantStock} шт.: ${color} / ${size}`}
              </p>
            )}
            <p className="text-[11px] text-muted mt-2">Зачёркнутые размеры сейчас недоступны</p>
            <details className="mt-4 border border-black/10 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium">Таблица размеров</summary>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-xs text-center min-w-[420px]">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">Размер</th>
                      <th>Грудь</th>
                      <th>Длина</th>
                      <th>Рукав</th>
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
                      <tr className="border-t" key={row[0]}>
                        {row.map((cell, index) => (
                          <td
                            className={`p-2 ${index === 0 ? 'text-left font-medium' : ''}`}
                            key={cell}
                          >
                            {cell}
                            {index > 0 ? ' см' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
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
                ? 'Нет в наличии'
                : 'Добавить в корзину'}
            </button>
          </div>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            className="btn border border-ink w-full mt-3"
          >
            Заказать в Telegram
          </a>
          <div className="mt-10 border-t text-sm">
            <Info n="Описание" v={p.description} />
            <Info n="Состав" v={p.material} />
            <Info n="Посадка" v={p.fit + (p.gsm ? ` · ${p.gsm}` : '')} />
            <Info n="Доставка" v="По России курьерской службой. Бесплатно от 7 000 ₽." />
          </div>
        </div>
      </main>
      {zoomed && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 p-4 md:p-10 grid place-items-center"
          onClick={() => setZoomed(false)}
        >
          <button
            aria-label="Close image"
            className="absolute top-5 right-5 text-white p-2"
            onClick={() => setZoomed(false)}
          >
            <X />
          </button>
          <div
            className="relative w-full h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
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
          <p className="eyebrow text-brown">Рекомендуем</p>
          <h2 className="display text-4xl mt-3 mb-10">
            {language === 'en' ? 'You may also like' : 'Вам также может понравиться'}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </>
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
