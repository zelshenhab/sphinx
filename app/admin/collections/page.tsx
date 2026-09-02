'use client';

import { useState } from 'react';
import { deleteCollection, saveCollection } from '@/core/supabase/collections';
import { useCatalog } from '@/features/catalog';
import { useNotification } from '@/features/notifications';

export default function CollectionsPage() {
  const { collections, products, refresh } = useCatalog();
  const { notify } = useNotification();
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const selected = collections.find((collection) => collection.id === editing);
  const [draft, setDraft] = useState({
    name: '',
    slug: '',
    active: true,
    productIds: [] as string[],
  });

  const open = (id: string | 'new') => {
    const collection = collections.find((item) => item.id === id);
    setDraft(
      collection
        ? {
            name: collection.name,
            slug: collection.slug,
            active: collection.active ?? true,
            productIds: collection.productIds,
          }
        : { name: '', slug: '', active: true, productIds: [] },
    );
    setEditing(id);
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
              placeholder="Slug"
              value={draft.slug}
              onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
            />
          </div>
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
        {collections.map((collection) => (
          <div key={collection.id} className="border-t py-4 flex items-center justify-between">
            <div>
              <b>{collection.name}</b>
              <p className="text-xs text-muted mt-1">
                {collection.productIds.length} products · {collection.active ? 'Active' : 'Hidden'}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => open(collection.id)}>Edit</button>
              <button
                className="text-red-700"
                onClick={async () => {
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
