import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicProduct } from '@/core/supabase/public-product';
import ProductDetails from '@/features/catalog/components/product-details';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getPublicProduct((await params).slug);
  if (!product) return { title: 'Product not found | SPHINX', robots: { index: false } };
  const title = `${product.name} | SPHINX`;
  const description = product.description.slice(0, 180);
  const images = product.images.slice(0, 1);
  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
export default async function ProductPage({ params }: Props) {
  const product = await getPublicProduct((await params).slug);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
