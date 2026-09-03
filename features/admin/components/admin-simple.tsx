'use client';

import { useEffect, useState } from 'react';
import { clientStorage } from '@/core/storage/client-storage';
import {
  listAdminContent,
  deleteAdminContent,
  saveAdminContent,
  uploadAdminImage,
  type ContentType,
} from '@/core/supabase/admin-content';
import { useNotification } from '@/features/notifications';
import { useCatalog } from '@/features/catalog';

type Row = Record<string, string>;

interface AdminSimpleProps {
  title: string;
  fields: string[];
}

export function AdminSimple({ title, fields }: AdminSimpleProps) {
  const { notify } = useNotification();
  const { refresh } = useCatalog();
  const storageKey = `sphinx-admin-${title.toLowerCase()}`;
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const local = clientStorage.get<Row[]>(storageKey, []);
      if (local.length) setRows(local);
      void listAdminContent(title as ContentType)
        .then((remote) => {
          if (remote.length) setRows(remote);
        })
        .catch((error) => console.info('[SPHINX_ADMIN_CONTENT_FALLBACK]', error));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey, title]);

  const persist = (next: Row[]) => {
    setRows(next);
    clientStorage.set(storageKey, next);
  };

  const add = () => {
    const row = Object.fromEntries(
      fields.map((field) => [field, field === 'Active' ? 'Yes' : `New ${field}`]),
    );
    persist([...rows, row]);
    notify({ ru: 'Запись добавлена', en: 'Record added' }, 'success');
  };

  const update = (rowIndex: number, field: string, value: string) => {
    persist(rows.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)));
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveAdminContent(title as ContentType, rows);
      await refresh();
      notify({ ru: 'Изменения сохранены в Supabase', en: 'Changes saved to Supabase' }, 'success');
    } catch (error) {
      console.error('[SPHINX_ADMIN_CONTENT_SAVE_ERROR]', error);
      notify({ ru: 'Не удалось сохранить изменения', en: 'Could not save changes' }, 'error');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (rowIndex: number, file: File) => {
    setUploading(rowIndex);
    try {
      const url = await uploadAdminImage(file);
      update(rowIndex, 'Image', url);
      notify(
        { ru: 'Изображение загружено. Нажмите «Сохранить»', en: 'Image uploaded. Click Save' },
        'success',
      );
    } catch (error) {
      console.error('[SPHINX_ADMIN_IMAGE_UPLOAD_ERROR]', error);
      notify({ ru: 'Не удалось загрузить изображение', en: 'Could not upload image' }, 'error');
    } finally {
      setUploading(null);
    }
  };

  const remove = async (rowIndex: number) => {
    const row = rows[rowIndex];
    if (!window.confirm('Удалить эту запись?')) return;
    try {
      if (row._id) await deleteAdminContent(title as ContentType, row._id);
      persist(rows.filter((_, index) => index !== rowIndex));
      await refresh();
      notify({ ru: 'Запись удалена', en: 'Record deleted' }, 'info');
    } catch (error) {
      console.error('[SPHINX_ADMIN_CONTENT_DELETE_ERROR]', error);
      notify({ ru: 'Не удалось удалить запись', en: 'Could not delete record' }, 'error');
    }
  };

  return (
    <div className="admin-card">
      <div className="flex justify-between mb-6">
        <h2 className="display text-2xl">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => void save()}
            disabled={saving || !rows.length}
            className="btn border border-ink disabled:opacity-40"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button onClick={add} className="btn btn-dark">
            Добавить
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted">Записей пока нет. Нажмите «Добавить».</p>
      ) : (
        rows.map((row, rowIndex) => (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t py-4 text-sm"
            key={rowIndex}
          >
            {fields.map((field) => (
              <div key={field}>
                <span className="block text-[10px] uppercase text-muted mb-1">{field}</span>
                {field === 'Active' ? (
                  <label className="flex items-center gap-3 border p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(row[field] ?? 'Yes').toLowerCase() !== 'no'}
                      onChange={(event) =>
                        update(rowIndex, field, event.target.checked ? 'Yes' : 'No')
                      }
                    />
                    <span>
                      {(row[field] ?? 'Yes').toLowerCase() !== 'no' ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                ) : (
                  <input
                    className="field"
                    value={row[field] ?? ''}
                    onChange={(event) => update(rowIndex, field, event.target.value)}
                  />
                )}
                {field === 'Image' && (
                  <input
                    className="mt-2 block w-full text-xs"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    disabled={uploading === rowIndex}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(rowIndex, file);
                    }}
                  />
                )}
              </div>
            ))}
            <button
              className="text-left text-xs text-red-700"
              onClick={() => void remove(rowIndex)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
