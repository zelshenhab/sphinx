'use client';

import { useEffect, useState } from 'react';
import { clientStorage } from '@/core/storage/client-storage';
import {
  listAdminContent,
  saveAdminContent,
  type ContentType,
} from '@/core/supabase/admin-content';
import { useNotification } from '@/features/notifications';

type Row = Record<string, string>;

interface AdminSimpleProps {
  title: string;
  fields: string[];
}

export function AdminSimple({ title, fields }: AdminSimpleProps) {
  const { notify } = useNotification();
  const storageKey = `sphinx-admin-${title.toLowerCase()}`;
  const [rows, setRows] = useState<Row[]>(() => clientStorage.get(storageKey, []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void listAdminContent(title as ContentType)
      .then((remote) => {
        if (remote.length) setRows(remote);
      })
      .catch((error) => console.info('[SPHINX_ADMIN_CONTENT_FALLBACK]', error));
  }, [title]);

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
      notify({ ru: 'Изменения сохранены в Supabase', en: 'Changes saved to Supabase' }, 'success');
    } catch (error) {
      console.error('[SPHINX_ADMIN_CONTENT_SAVE_ERROR]', error);
      notify({ ru: 'Не удалось сохранить изменения', en: 'Could not save changes' }, 'error');
    } finally {
      setSaving(false);
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
              <input
                className="field"
                key={field}
                value={row[field]}
                onChange={(event) => update(rowIndex, field, event.target.value)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
