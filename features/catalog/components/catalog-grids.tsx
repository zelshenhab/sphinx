'use client';
import { ProductGrid, ProductGridSkeleton } from './product-card';
import { useCatalog } from '../catalog-provider';
export function FeaturedProductGrid({ limit = 8 }: { limit?: number }) {
  const { categories, products, loading } = useCatalog();
  if (loading) return <ProductGridSkeleton count={limit} />;
  return (
    <ProductGrid
      products={products
        .filter(
          (product) =>
            product.featured &&
            categories.some((category) => category.slug === product.category && category.active),
        )
        .slice(0, limit)}
    />
  );
}
export function CategoryProductGrid({ category }: { category: string }) {
  const { products, loading } = useCatalog();
  if (loading) return <ProductGridSkeleton />;
  return <ProductGrid products={products.filter((product) => product.category === category)} />;
}
