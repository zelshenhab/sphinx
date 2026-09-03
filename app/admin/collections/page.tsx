'use client';

import { useState } from 'react';
import Image from 'next/image';
import { deleteCollection, saveCollection } from '@/core/supabase/collections';
import { uploadAdminImage } from '@/core/supabase/admin-content';
import { useCatalog } from '@/features/catalog';
import { useNotification } from '@/features/notifications';

export default function CollectionsPage() {
  const { collections, products, refresh } = useCatalog();
  const { notify } = useNotification();
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const selected = collections.find((collection) => collection.id === editing);
  const [draft, setDraft] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    image: '',
    status: 'available' as 'available' | 'coming-soon',
    sortOrder: 0,
    active: true,
    productIds: [] as string[],
  });
  const [uploading, setUploading] = useState(false);

  const open = (id: string | 'new') => {
    const collection = collections.find((item) => item.id === id);
    setDraft(
      collection
        ? {
            name: collection.name,
            nameEn: collection.nameEn ?? '',
            slug: collection.slug,
            description: collection.description ?? '',
            descriptionEn: collection.descriptionEn ?? '',
            image: collection.image ?? '',
            status: collection.status ?? 'available',
            sortOrder: collection.sortOrder ?? 0,
            active: collection.active ?? true,
            productIds: collection.productIds,
          }
        : {
            name: '',
            nameEn: '',
            slug: '',
            description: '',
            descriptionEn: '',
            image: '',
            status: 'available',
            sortOrder: collections.length,
            active: true,
            productIds: [],
          },
    );
    setEditing(id);
  };
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const image = await uploadAdminImage(file);
      setDraft((current) => ({ ...current, image }));
      notify({ ru: 'Изображение загружено', en: 'Image uploaded' }, 'success');
    } catch (error) {
      console.error('[SPHINX_COLLECTION_IMAGE_ERROR]', error);
      notify({ ru: 'Не удалось загрузить изображение', en: 'Could not upload image' }, 'error');
    } finally {
      setUploading(false);
    }
  };
  const save = async () => {
    if (!draft.name.trim() || !draft.slug.trim()) return notify('required_fields', 'warning');
    try {
      await saveCollection({ id: selected?.id, ...draft });
      await refresh();
      setEditing(null);
      notify({ ru: 'Коллекция сохранена', en: 'Collection saved' }, 'success');
    } catch (error) {
      console.error('[SPHINX_COLLECTION_SAVE_ERROR]', error);
      notify({ ru: 'Не удалось сохранить коллекцию', en: 'Could not save collection' }, 'error');
    }
  };
  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="display text-2xl">Collections</h2>
        <button className="btn btn-dark" onClick={() => open('new')}>
          Добавить
        </button>
      </div>
      {editing && (
        <div className="bg-sand/50 p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="field"
              placeholder="Name"
              value={draft.name}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  name: event.target.value,
                  slug: draft.slug || event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                })
              }
            />
            <input
              className="field"
              placeholder="English name"
              value={draft.nameEn}
              onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })}
            />
            <input
              className="field"
              placeholder="Slug"
              value={draft.slug}
              onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
            />
            <input
              className="field"
              type="number"
              min="0"
              placeholder="Sort order"
              value={draft.sortOrder}
              onChange={(event) =>
                setDraft({ ...draft, sortOrder: Math.max(0, Number(event.target.value)) })
              }
            />
            <textarea
              className="field md:col-span-2"
              rows={2}
              placeholder="Description"
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
            <textarea
              className="field md:col-span-2"
              rows={2}
              placeholder="English description"
              value={draft.descriptionEn}
              onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })}
            />
            <input
              className="field"
              placeholder="Cover image URL"
              value={draft.image}
              onChange={(event) => setDraft({ ...draft, image: event.target.value })}
            />
            <input
              className="field"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadImage(file);
              }}
            />
            <select
              className="field"
              value={draft.status}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  status: event.target.value as 'available' | 'coming-soon',
                })
              }
            >
              <option value="available">Available</option>
              <option value="coming-soon">Coming soon</option>
            </select>
          </div>
          {draft.image && (
            <div className="relative mt-4 aspect-[16/6] max-w-xl overflow-hidden bg-white">
              <Image src={draft.image} alt="Collection preview" fill className="object-cover" />
            </div>
          )}
          <label className="flex gap-2 mt-4 text-sm">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
            />
            Active
          </label>
          <p className="text-xs uppercase text-muted mt-5 mb-3">Products</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {products.map((product) => (
              <label key={product.id} className="flex gap-2 text-sm border p-3 bg-white">
                <input
                  type="checkbox"
                  checked={draft.productIds.includes(product.id)}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      productIds: event.target.checked
                        ? [...draft.productIds, product.id]
                        : draft.productIds.filter((id) => id !== product.id),
                    })
                  }
                />
                {product.name}
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <button className="btn btn-dark" onClick={() => void save()}>
              Сохранить
            </button>
            <button className="btn border" onClick={() => setEditing(null)}>
              Отмена
            </button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {[...collections]
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((collection) => (
            <div
              key={collection.id}
              className="border-t py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-20 h-16 shrink-0 bg-sand overflow-hidden">
                  {collection.image && (
                    <Image src={collection.image} alt="" fill className="object-cover" />
                  )}
                </div>
                <div>
                  <b>{collection.name}</b>
                  <p className="text-xs text-muted mt-1">
                    {collection.productIds.length} products ·{' '}
                    {collection.active ? 'Active' : 'Hidden'} ·{' '}
                    {collection.status === 'coming-soon' ? 'Coming soon' : 'Available'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <button onClick={() => open(collection.id)}>Edit</button>
                <button
                  className="text-red-700"
                  onClick={async () => {
                    if (!window.confirm('Удалить эту коллекцию?')) return;
                    await deleteCollection(collection.id);
                    await refresh();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
