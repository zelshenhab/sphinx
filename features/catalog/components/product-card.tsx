'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatPrice } from '@/config/site';
import { useCart } from '@/features/cart';

const storefrontColors = [
  { label: 'Black', aliases: ['black', 'чёрный', 'черный'], value: '#1d1d1b' },
  { label: 'White', aliases: ['white', 'белый'], value: '#ffffff' },
  { label: 'Beige', aliases: ['beige', 'sand', 'бежевый'], value: '#c8ad82' },
  { label: 'Olive', aliases: ['olive', 'khaki', 'оливковый', 'хаки'], value: '#596044' },
] as const;

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const availableVariant = product.colors.flatMap((color) =>
    product.sizes.map((size) => ({
      color,
      size,
      stock: product.variantStock?.[`${color}::${size}`] ?? product.sizeStock?.[size] ?? product.stockQuantity ?? 99,
    })),
  ).find((variant) => variant.stock > 0);
  const totalStock = product.variantStock
    ? Object.values(product.variantStock).reduce((total, stock) => total + stock, 0)
    : product.stockQuantity;
  const galleryColor = product.colors.find(
    (color) => (product.colorImages?.[color]?.length ?? 0) > 0,
  );
  const quickAddColor = availableVariant?.color ?? galleryColor ?? product.colors[0];
  const quickAddSize = availableVariant?.size ?? product.sizes[0];
  const lowStock =
    totalStock !== undefined && totalStock > 0 && totalStock <= 10;
  const availableSwatches = storefrontColors.filter((swatch) =>
    product.colors.some((color) =>
      swatch.aliases.some((alias) => alias === color.trim().toLowerCase()),
    ),
  );
  return (
    <article className="group">
      <Link
        href={`/product/${product.slug}`}
        className="relative block bg-sand overflow-hidden aspect-[4/5]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        {(product.isNew || product.isSale) && (
          <span className="absolute top-3 left-3 bg-white px-3 py-1 text-[9px] tracking-widest">
            {product.isSale ? 'SALE' : 'NEW'}
          </span>
        )}
        {lowStock && (
          <span className="absolute bottom-3 left-3 bg-ink text-white px-3 py-1.5 text-[9px] tracking-wider">
            Осталось {totalStock} шт.
          </span>
        )}
        {totalStock === 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-center py-2 text-[10px] tracking-widest">
            НЕТ В НАЛИЧИИ
          </span>
        )}
      </Link>
      <div className="pt-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-end mt-2">
          <p className="text-sm">
            <b>{formatPrice(product.price)}</b>
            {product.oldPrice && <s className="text-muted ml-2">{formatPrice(product.oldPrice)}</s>}
          </p>
          <button
            disabled={totalStock === 0 || !quickAddSize}
            onClick={() => add(product, quickAddColor, quickAddSize)}
            className="text-[10px] uppercase tracking-wider border-b border-black disabled:opacity-35 disabled:cursor-not-allowed"
          >
            Быстро добавить
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {availableSwatches.map((swatch) => (
            <i
              title={swatch.label}
              aria-label={swatch.label}
              key={swatch.label}
              className="w-3.5 h-3.5 rounded-full border border-black/25 shadow-sm"
              style={{ backgroundColor: swatch.value }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-7">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
