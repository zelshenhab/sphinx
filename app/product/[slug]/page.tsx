'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
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
  const hasColorGalleries = Object.values(p.colorImages ?? {}).some((images) => images.length > 0);
  const isColorAvailable = (candidate: string) =>
    p.colors.includes(candidate) &&
    (!hasColorGalleries || (p.colorImages?.[candidate]?.length ?? 0) > 0);
  const defaultColor = p.colors.find(isColorAvailable) ?? p.colors.find(Boolean) ?? '';
  const [color, setColor] = useState(defaultColor);
  const [size, setSize] = useState(p.sizes[0]);
  const [q, setQ] = useState(1);
  const [image, setImage] = useState(p.colorImages?.[defaultColor]?.[0] || p.images[0]);
  const { add } = useCart();
  const { categories, products, settings } = useCatalog();
  const { language } = useLanguage();
  const relatedProducts = [
    ...products.filter(
      (product) =>
        product.id !== p.id && product.category === p.category && product.stockQuantity !== 0,
    ),
    ...products.filter(
      (product) =>
        product.id !== p.id &&
        product.category !== p.category &&
        product.stockQuantity !== 0 &&
        categories.some((category) => category.slug === product.category && category.active),
    ),
  ].slice(0, 4);
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
  };
  return (
    <>
      <main className="container-x py-10 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="grid md:grid-cols-[96px_minmax(0,1fr)] gap-3 items-start">
          <div className="relative aspect-[4/5] bg-sand overflow-hidden group/gallery md:col-start-2 md:row-start-1">
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
                  onClick={() => navigateImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center bg-white/85 backdrop-blur opacity-100 md:opacity-0 md:group-hover/gallery:opacity-100 focus:opacity-100 hover:bg-white"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => navigateImage(1)}
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
          <h1 className="display text-4xl mt-4">SPHINX — {p.name}</h1>
          <p className="text-xl mt-5">{formatPrice(p.price)}</p>
          {p.stockQuantity === 0 ? (
            <p className="text-sm text-red-700 mt-3">Нет в наличии</p>
          ) : p.stockQuantity !== undefined && p.stockQuantity <= 10 ? (
            <p className="text-sm text-amber-700 mt-3">Осталось всего {p.stockQuantity} шт.</p>
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
            <div className="grid grid-cols-6 gap-2 mt-3">
              {allSizes.map((s) => {
                const available = p.sizes.includes(s);
                return (
                  <button
                    disabled={!available}
                    onClick={() => setSize(s)}
                    key={s}
                    title={available ? s : `${s} — недоступен`}
                    className={`relative py-3 text-xs border ${size === s && available ? 'bg-ink text-white' : 'border-black/15'} ${available ? '' : 'cursor-not-allowed opacity-35 line-through bg-black/5'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted mt-2">Зачёркнутые размеры сейчас недоступны</p>
          </div>
          <div className="flex gap-3 mt-7">
            <div className="flex border border-black/20 items-center gap-4 px-4">
              <button onClick={() => setQ(Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              {q}
              <button onClick={() => setQ(Math.min(q + 1, p.stockQuantity ?? 99))}>
                <Plus size={14} />
              </button>
            </div>
            <button
              disabled={p.stockQuantity === 0}
              onClick={() => add(p, color, size, q)}
              className="btn btn-dark flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {p.stockQuantity === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
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
      {relatedProducts.length > 0 && (
        <section className="container-x pt-10 pb-24 border-t border-black/10">
          <p className="eyebrow text-brown">Recommended</p>
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
