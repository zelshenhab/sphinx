'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatPrice, getColorSwatch } from '@/config/site';
import { useCart } from '@/features/cart';
import { useLanguage } from '@/features/i18n';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { language } = useLanguage();
  const [previewColor, setPreviewColor] = useState(product.colors[0] ?? '');
  const availableVariant = product.colors
    .flatMap((color) =>
      product.sizes.map((size) => ({
        color,
        size,
        stock:
          product.variantStock?.[`${color}::${size}`] ??
          product.sizeStock?.[size] ??
          product.stockQuantity ??
          99,
      })),
    )
    .find((variant) => variant.stock > 0);
  const totalStock = product.variantStock
    ? Object.values(product.variantStock).reduce((total, stock) => total + stock, 0)
    : product.stockQuantity;
  const galleryColor = product.colors.find(
    (color) => (product.colorImages?.[color]?.length ?? 0) > 0,
  );
  const quickAddColor = availableVariant?.color ?? galleryColor ?? product.colors[0];
  const quickAddSize = availableVariant?.size ?? product.sizes[0];
  const lowStock = totalStock !== undefined && totalStock > 0 && totalStock <= 10;
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
  const previewImages = product.colorImages?.[previewColor]?.length
    ? product.colorImages[previewColor]
    : product.images;
  const primaryImage = previewImages[0] ?? product.images[0];
  const secondaryImage = previewImages[1] ?? product.images[1];
  return (
    <article className="group product-card">
      <Link
        href={`/product/${product.slug}`}
        className="relative block bg-sand overflow-hidden aspect-[4/5]"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 1023px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        {secondaryImage && secondaryImage !== primaryImage && (
          <Image
            src={secondaryImage}
            alt=""
            fill
            sizes="(max-width: 1023px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden md:block"
          />
        )}
        {(product.isNew || product.isSale) && (
          <span className="absolute top-3 left-3 bg-white px-3 py-1 text-[9px] tracking-widest">
            {product.isSale ? 'SALE' : 'NEW'}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 bg-red-700 text-white px-2.5 py-1 text-[9px] tracking-wider">
            −{discountPercent}%
          </span>
        )}
        {lowStock && (
          <span className="absolute bottom-3 left-3 bg-ink text-white px-3 py-1.5 text-[9px] tracking-wider">
            {language === 'en' ? `Only ${totalStock} left` : `Осталось ${totalStock} шт.`}
          </span>
        )}
        {totalStock === 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-center py-2 text-[10px] tracking-widest">
            {language === 'en' ? 'OUT OF STOCK' : 'НЕТ В НАЛИЧИИ'}
          </span>
        )}
        {previewImages.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1 md:hidden">
            {previewImages.slice(0, 4).map((image, index) => (
              <i
                key={image}
                className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-ink' : 'bg-white/80'}`}
              />
            ))}
          </div>
        )}
      </Link>
      <div className="pt-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm line-clamp-2 min-h-10">{product.name}</h3>
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-2 min-h-8">
          <b className={discountPercent > 0 ? 'text-sm text-red-700' : 'text-sm'}>
            {formatPrice(product.price)}
          </b>
          {product.oldPrice && (
            <s className="text-muted text-xs whitespace-nowrap">{formatPrice(product.oldPrice)}</s>
          )}
          {discountPercent > 0 && (
            <span className="text-[9px] font-medium text-red-700 whitespace-nowrap">
              {language === 'en' ? 'You save' : 'Скидка'} {discountPercent}%
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          {product.colors.map((color) => (
            <button
              type="button"
              title={color}
              aria-label={`${language === 'en' ? 'Preview' : 'Показать'} ${color}`}
              key={color}
              onClick={() => setPreviewColor(color)}
              className={`w-4 h-4 rounded-full border shadow-sm ${previewColor === color ? 'ring-1 ring-ink ring-offset-2' : 'border-black/25'}`}
              style={{ backgroundColor: getColorSwatch(color) }}
            />
          ))}
        </div>
        <button
          disabled={totalStock === 0 || !quickAddSize}
          onClick={() => add(product, quickAddColor, quickAddSize)}
          className="mt-3 w-full min-h-10 px-2 border border-black text-[9px] sm:text-[10px] uppercase tracking-[.08em] whitespace-nowrap hover:bg-ink hover:text-white disabled:opacity-35 disabled:cursor-not-allowed"
        >
          {language === 'en' ? 'Quick add' : 'Быстро добавить'}
        </button>
      </div>
    </article>
  );
}
export function ProductGrid({
  products,
  mobileColumns = 2,
}: {
  products: Product[];
  mobileColumns?: 1 | 2;
}) {
  return (
    <div
      className={`grid ${mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'} lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-7`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-7"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true">
          <div className="aspect-[4/5] skeleton-shimmer" />
          <div className="h-3 w-3/4 mt-4 skeleton-shimmer" />
          <div className="h-3 w-1/3 mt-3 skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}
