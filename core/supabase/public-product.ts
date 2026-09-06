import { cache } from 'react';
import { createClient } from './server';
import { rowToProduct } from '@/features/catalog/services/product-repository';

export const getPublicProduct = cache(async (slug: string) => {
  const db = await createClient();
  const { data, error } = await db
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('in_stock', true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [{ data: category, error: categoryError }, { data: metadata, error: metadataError }] =
    await Promise.all([
      db.from('categories').select('active').eq('slug', data.category_slug).maybeSingle(),
      db
        .from('store_settings')
        .select('key,value')
        .in('key', [
          `product_variant_stock:${data.id}`,
          `product_color_images:${data.id}`,
          `product_stock:${data.id}`,
          `product_size_stock:${data.id}`,
        ]),
    ]);
  if (categoryError || metadataError) throw categoryError || metadataError;
  if (!category?.active) return null;
  const values = Object.fromEntries(
    (metadata ?? []).map((row) => [row.key.split(':')[0], row.value]),
  );
  return {
    ...rowToProduct(data),
    colorImages: values.product_color_images as Record<string, string[]> | undefined,
    variantStock: values.product_variant_stock as Record<string, number> | undefined,
    sizeStock: values.product_size_stock as Record<string, number> | undefined,
    stockQuantity: Number(values.product_stock ?? 0),
  };
});
