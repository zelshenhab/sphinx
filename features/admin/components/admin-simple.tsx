'use client';

import { useState } from 'react';
import { clientStorage } from '@/core/storage/client-storage';
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

  const persist = (next: Row[]) => {
    setRows(next);
    clientStorage.set(storageKey, next);
  };

  const add = () => {
    const row = Object.fromEntries(
      fields.map((field) => [field, field === 'Active' ? 'Yes' : `New ${field}`]),
    );
    persist([...rows, row]);
    notify({ru:'Запись добавлена',en:'Record added'}, 'success');
  };

  const update = (rowIndex: number, field: string, value: string) => {
    persist(rows.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)));
  };

  return (
    <div className="admin-card">
      <div className="flex justify-between mb-6">
        <h2 className="display text-2xl">{title}</h2>
        <button onClick={add} className="btn btn-dark">Добавить</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted">Локальных записей пока нет. Нажмите «Добавить», чтобы проверить прототип.</p>
      ) : (
        rows.map((row, rowIndex) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t py-4 text-sm" key={rowIndex}>
            {fields.map((field) => (
              <input className="field" key={field} value={row[field]} onChange={(event) => update(rowIndex, field, event.target.value)} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
