import { createClient } from '@/core/supabase/client';
import type { Category, Product } from '@/types';

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
  const { data, error } = await createClient()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}
export async function listCategories(): Promise<Category[]> {
  const { data, error } = await createClient()
    .from('categories')
    .select('id,name,slug,image,active')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as Category[];
}
export async function createProduct(product: Product) {
  const { data, error } = await createClient()
    .from('products')
    .insert(productToRow(product))
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}
export async function deleteProduct(id: string) {
  const { error } = await createClient().from('products').delete().eq('id', id);
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
