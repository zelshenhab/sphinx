import { createClient } from './client';

type ContentType = 'Categories' | 'Collections' | 'Banners';
type Row = Record<string, string>;

const configs = {
  Categories: {
    table: 'categories',
    fields: { Name: 'name', Slug: 'slug', Image: 'image', Active: 'active' },
  },
  Collections: { table: 'collections', fields: { Name: 'name', Slug: 'slug', Active: 'active' } },
  Banners: {
    table: 'banners',
    fields: { Title: 'title', Subtitle: 'subtitle', 'CTA text': 'cta_text', 'CTA URL': 'cta_url' },
  },
} as const;

export async function listAdminContent(type: ContentType): Promise<Row[]> {
  const config = configs[type];
  const { data, error } = await createClient().from(config.table).select('*').order('created_at');
  if (error) throw error;
  return (data ?? []).map((record) => {
    const row: Row = { _id: String(record.id) };
    for (const [label, column] of Object.entries(config.fields))
      row[label] =
        typeof record[column] === 'boolean'
          ? record[column]
            ? 'Yes'
            : 'No'
          : String(record[column] ?? '');
    return row;
  });
}

export async function saveAdminContent(type: ContentType, rows: Row[]) {
  const config = configs[type];
  const records = rows.map((row) => {
    const record: Record<string, string | boolean> = {};
    if (row._id) record.id = row._id;
    for (const [label, column] of Object.entries(config.fields))
      record[column] =
        column === 'active' ? row[label]?.toLowerCase() !== 'no' : (row[label] ?? '');
    return record;
  });
  const { error } = await createClient().from(config.table).upsert(records);
  if (error) throw error;
}

export type { ContentType };
