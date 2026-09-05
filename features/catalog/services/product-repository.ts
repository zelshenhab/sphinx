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
  const variantStock = new Map(
    (mediaRows ?? [])
      .filter((row) => row.key.startsWith('product_variant_stock:'))
      .map((row) => [
        row.key.replace('product_variant_stock:', ''),
        row.value as Record<string, number>,
      ]),
  );
  return (data as ProductRow[]).map((row) => {
    const variants = variantStock.get(row.id);
    return {
      ...rowToProduct(row),
      colorImages: media.get(row.id) ?? {},
      sizeStock: sizeStock.get(row.id) ?? undefined,
      variantStock: variants,
      stockQuantity: variants
        ? Object.values(variants).reduce((total, quantity) => total + quantity, 0)
        : (stock.get(row.id) ?? 20),
    };
  });
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
  const supabase = createClient();
  const [{ data, error }, { data: metaRows }] = await Promise.all([
    supabase
      .from('collections')
      .select('id,name,slug,active,collection_products(product_id)')
      .order('created_at'),
    supabase.from('store_settings').select('key,value').like('key', 'collection_meta:%'),
  ]);
  if (error) throw error;
  const metadata = new Map(
    (metaRows ?? []).map((row) => [
      row.key.replace('collection_meta:', ''),
      row.value as Partial<Collection>,
    ]),
  );
  return (data ?? [])
    .map((collection) => ({
      ...metadata.get(collection.id),
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      active: collection.active,
      productIds: (collection.collection_products ?? []).map((item) => item.product_id),
    }))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export async function listBanners(): Promise<Banner[]> {
  const supabase = createClient();
  const [{ data, error }, { data: metaRows }] = await Promise.all([
    supabase
      .from('banners')
      .select('id,title,subtitle,image,cta_text,cta_url,active,sort_order')
      .order('sort_order'),
    supabase.from('store_settings').select('key,value').like('key', 'banner_meta:%'),
  ]);
  if (error) throw error;
  const metadata = new Map(
    (metaRows ?? []).map((row) => [
      row.key.replace('banner_meta:', ''),
      row.value as Partial<Banner>,
    ]),
  );
  return (data ?? []).map((banner) => ({
    ...metadata.get(banner.id),
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    image: banner.image,
    ctaText: banner.cta_text,
    ctaUrl: banner.cta_url,
    active: banner.active,
    sortOrder: banner.sort_order,
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
    variantStock: product.variantStock ?? {},
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
    variantStock: product.variantStock ?? {},
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
      `product_variant_stock:${id}`,
    ]);
}
async function saveProductMetadata(supabase: ReturnType<typeof createClient>, product: Product) {
  const { error } = await supabase.from('store_settings').upsert([
    { key: `product_color_images:${product.id}`, value: product.colorImages ?? {} },
    { key: `product_stock:${product.id}`, value: product.stockQuantity ?? 20 },
    { key: `product_size_stock:${product.id}`, value: product.sizeStock ?? {} },
    { key: `product_variant_stock:${product.id}`, value: product.variantStock ?? {} },
  ]);
  if (error) throw error;
}
export async function uploadProductImage(file: File) {
  const optimizedFile = await optimizeProductImage(file);
  const extension = optimizedFile.name.split('.').pop()?.toLowerCase() || 'webp';
  const path = `${crypto.randomUUID()}.${extension}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, optimizedFile, { cacheControl: '31536000', contentType: optimizedFile.type });
  if (error) throw error;
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}

async function optimizeProductImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1800;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.86),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
