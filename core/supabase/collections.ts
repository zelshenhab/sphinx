import { createClient } from './client';

export async function saveCollection(input: {
  id?: string;
  name: string;
  slug: string;
  active: boolean;
  productIds: string[];
}) {
  const supabase = createClient();
  const payload = { name: input.name.trim(), slug: input.slug.trim(), active: input.active };
  const query = input.id
    ? supabase.from('collections').update(payload).eq('id', input.id).select('id').single()
    : supabase.from('collections').insert(payload).select('id').single();
  const { data, error } = await query;
  if (error) throw error;
  const collectionId = data.id;
  const { error: deleteError } = await supabase
    .from('collection_products')
    .delete()
    .eq('collection_id', collectionId);
  if (deleteError) throw deleteError;
  if (input.productIds.length) {
    const { error: relationError } = await supabase
      .from('collection_products')
      .insert(
        input.productIds.map((productId, sortOrder) => ({
          collection_id: collectionId,
          product_id: productId,
          sort_order: sortOrder,
        })),
      );
    if (relationError) throw relationError;
  }
}

export async function deleteCollection(id: string) {
  const { error } = await createClient().from('collections').delete().eq('id', id);
  if (error) throw error;
}
