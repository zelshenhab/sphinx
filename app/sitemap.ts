import type { MetadataRoute } from 'next';
import { createClient } from '@/core/supabase/server';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await createClient();
  const [{ data: products, error }, { data: categories, error: categoryError }] = await Promise.all(
    [
      db.from('products').select('slug,category_slug,updated_at').eq('in_stock', true),
      db.from('categories').select('slug').eq('active', true),
    ],
  );
  if (error || categoryError) throw error || categoryError;
  const origin = 'https://sphinx-store.vercel.app';
  return [
    ...['', '/shop', '/about', '/contact', '/privacy', '/returns', '/terms'].map((path) => ({
      url: origin + path,
    })),
    ...(categories ?? []).map((category) => ({ url: `${origin}/shop/${category.slug}` })),
    ...(products ?? [])
      .filter((product) => categories?.some((category) => category.slug === product.category_slug))
      .map((product) => ({
        url: `${origin}/product/${product.slug}`,
        lastModified: product.updated_at,
      })),
  ];
}
