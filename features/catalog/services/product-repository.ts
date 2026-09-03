import { createClient } from '@/core/supabase/client';
import type { Banner, Category, Collection, Product } from '@/types';

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category_slug: string;
  description: string;
  price: number;
  old_price: number | null;
  colors: string[];
  sizes: string[];
  images: string[];
  featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  material: string;
  gsm: string | null;
  fit: string;
  product_type: 'Streetwear' | 'Performance';
  in_stock: boolean;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category_slug,
    description: row.description,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    colors: row.colors,
    sizes: row.sizes,
    images: row.images,
    featured: row.featured,
    isNew: row.is_new,
    isSale: row.is_sale,
    material: row.material,
    gsm: row.gsm ?? undefined,
    fit: row.fit,
    type: row.product_type,
  };
}
export function productToRow(product: Product) {
  return {
    name: product.name,
    slug: product.slug,
    category_slug: product.category,
    description: product.description,
    price: product.price,
    old_price: product.oldPrice ?? null,
    colors: product.colors,
    sizes: product.sizes,
    images: product.images,
    featured: product.featured,
    is_new: product.isNew ?? false,
    is_sale: product.isSale ?? false,
    material: product.material,
    gsm: product.gsm ?? null,
    fit: product.fit,
    product_type: product.type,
    in_stock: true,
  };
}

export async function listProducts() {
  const supabase = createClient();
  const [{ data, error }, { data: mediaRows, error: mediaError }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('store_settings').select('key,value'),
  ]);
  if (error) throw error;
  if (mediaError) throw mediaError;
  const media = new Map(
    (mediaRows ?? [])
      .filter((row) => row.key.startsWith('product_color_images:'))
      .map((row) => [
        row.key.replace('product_color_images:', ''),
        row.value as Record<string, string[]>,
      ]),
  );
  const stock = new Map(
    (mediaRows ?? [])
      .filter((row) => row.key.startsWith('product_stock:'))
      .map((row) => [row.key.replace('product_stock:', ''), Number(row.value)]),
  );
  const sizeStock = new Map(
    (mediaRows ?? [])
      .filter((row) => row.key.startsWith('product_size_stock:'))
      .map((row) => [
        row.key.replace('product_size_stock:', ''),
        row.value as Record<string, number>,
      ]),
  );
  return (data as ProductRow[]).map((row) => ({
    ...rowToProduct(row),
    colorImages: media.get(row.id) ?? {},
    sizeStock: sizeStock.get(row.id) ?? undefined,
    stockQuantity: stock.get(row.id) ?? 20,
  }));
}
export async function listCategories(): Promise<Category[]> {
  const { data, error } = await createClient()
    .from('categories')
    .select('id,name,slug,image,active')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as Category[];
}
export async function listCollections(): Promise<Collection[]> {
  const { data, error } = await createClient()
    .from('collections')
    .select('id,name,slug,active,collection_products(product_id)')
    .order('created_at');
  if (error) throw error;
  return (data ?? []).map((collection) => ({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    active: collection.active,
    productIds: (collection.collection_products ?? []).map((item) => item.product_id),
  }));
}
export async function listBanners(): Promise<Banner[]> {
  const { data, error } = await createClient()
    .from('banners')
    .select('id,title,subtitle,image,cta_text,cta_url,active')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []).map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    image: banner.image,
    ctaText: banner.cta_text,
    ctaUrl: banner.cta_url,
    active: banner.active,
  }));
}
export async function listStoreSettings(): Promise<Record<string, string>> {
  const { data, error } = await createClient().from('store_settings').select('key,value');
  if (error) throw error;
  return Object.fromEntries(
    (data ?? [])
      .filter((row) => typeof row.value === 'string')
      .map((row) => [row.key, row.value as string]),
  );
}
export async function createProduct(product: Product) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .insert(productToRow(product))
    .select()
    .single();
  if (error) throw error;
  const created = {
    ...rowToProduct(data as ProductRow),
    colorImages: product.colorImages ?? {},
    sizeStock: product.sizeStock ?? {},
    stockQuantity: product.stockQuantity ?? 20,
  };
  await saveProductMetadata(supabase, created);
  return created;
}
export async function updateProduct(product: Product) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .update(productToRow(product))
    .eq('id', product.id)
    .select()
    .single();
  if (error) throw error;
  await saveProductMetadata(supabase, product);
  return {
    ...rowToProduct(data as ProductRow),
    colorImages: product.colorImages ?? {},
    sizeStock: product.sizeStock ?? {},
    stockQuantity: product.stockQuantity ?? 20,
  };
}
export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  await supabase
    .from('store_settings')
    .delete()
    .in('key', [
      `product_color_images:${id}`,
      `product_stock:${id}`,
      `product_size_stock:${id}`,
    ]);
}
async function saveProductMetadata(supabase: ReturnType<typeof createClient>, product: Product) {
  const { error } = await supabase.from('store_settings').upsert([
    { key: `product_color_images:${product.id}`, value: product.colorImages ?? {} },
    { key: `product_stock:${product.id}`, value: product.stockQuantity ?? 20 },
    { key: `product_size_stock:${product.id}`, value: product.sizeStock ?? {} },
  ]);
  if (error) throw error;
}
export async function uploadProductImage(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600' });
  if (error) throw error;
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}
