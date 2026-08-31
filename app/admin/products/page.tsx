'use client';
import { useState } from 'react';
import Image from 'next/image';
import { products as seed } from '@/features/catalog';
import { Product } from '@/types';
import { formatPrice } from '@/config/site';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
import { useNotification } from '@/features/notifications';
const blank = {
  name: '',
  slug: '',
  category: 't-shirts',
  price: '',
  oldPrice: '',
  description: '',
  material: '100% хлопок',
  gsm: '240 GSM',
  fit: 'Unisex Oversized',
  colors: 'Black, White, Sand',
  sizes: 'XS, S, M, L, XL, XXL',
  image: '/assets/products/egyptian-power-dark.svg',
  type: 'Streetwear' as Product['type'],
  featured: true,
  isNew: true,
  isSale: false,
};
function load() {
  return clientStorage.get(storageKeys.products, seed);
}
export default function Products() {
  const { notify } = useNotification();
  const [list, setList] = useState<Product[]>(load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const save = (x: Product[]) => {
    setList(x);
    clientStorage.set(storageKeys.products, x);
  };
  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim() || !Number(form.price)) {
      setError('اكتب اسم المنتج وSlug والسعر.');
      notify('required_fields', 'warning');
      return;
    }
    const p: Product = {
      id: Date.now().toString(),
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      description: form.description || 'Новая модель SPHINX.',
      material: form.material,
      gsm: form.gsm || undefined,
      fit: form.fit,
      colors: form.colors
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      sizes: form.sizes
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      images: [form.image || blank.image],
      type: form.type,
      featured: form.featured,
      isNew: form.isNew,
      isSale: form.isSale,
    };
    save([p, ...list]);
    setForm(blank);
    setError('');
    setOpen(false);
    notify('product_created', 'success');
  };
  return (
    <div className="admin-card overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="display text-2xl">Товары</h2>
          <p className="text-xs text-muted mt-1">{list.length} товаров · сохранение в браузере</p>
        </div>
        <button onClick={() => setOpen(!open)} className="btn btn-dark">
          {open ? 'Закрыть' : 'Добавить товар'}
        </button>
      </div>
      {open && (
        <form onSubmit={create} className="bg-sand/60 border border-black/10 p-5 mb-7">
          <h3 className="display text-xl mb-5">Новый товар</h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field
              label="Name *"
              value={form.name}
              change={(v) =>
                setForm({
                  ...form,
                  name: v,
                  slug:
                    form.slug ||
                    v
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, ''),
                })
              }
            />
            <Field label="Slug *" value={form.slug} change={(v) => setForm({ ...form, slug: v })} />
            <label>
              <T>Category</T>
              <select
                className="field mt-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="t-shirts">T-Shirts</option>
                <option value="hoodies">Hoodies</option>
                <option value="sweatshirts">Sweatshirts</option>
                <option value="sport">Sport</option>
              </select>
            </label>
            <Field
              label="Price *"
              type="number"
              value={form.price}
              change={(v) => setForm({ ...form, price: v })}
            />
            <Field
              label="Old price"
              type="number"
              value={form.oldPrice}
              change={(v) => setForm({ ...form, oldPrice: v })}
            />
            <label>
              <T>Product type</T>
              <select
                className="field mt-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Product['type'] })}
              >
                <option>Streetwear</option>
                <option>Performance</option>
              </select>
            </label>
            <Field
              label="Colors"
              value={form.colors}
              change={(v) => setForm({ ...form, colors: v })}
            />
            <Field
              label="Sizes"
              value={form.sizes}
              change={(v) => setForm({ ...form, sizes: v })}
            />
            <Field
              label="Image path"
              value={form.image}
              change={(v) => setForm({ ...form, image: v })}
            />
            <Field
              label="Material"
              value={form.material}
              change={(v) => setForm({ ...form, material: v })}
            />
            <Field label="GSM" value={form.gsm} change={(v) => setForm({ ...form, gsm: v })} />
            <Field label="Fit" value={form.fit} change={(v) => setForm({ ...form, fit: v })} />
            <label className="md:col-span-2 xl:col-span-3">
              <T>Description</T>
              <textarea
                className="field mt-2"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>
          <div className="flex gap-5 mt-5 text-sm">
            <Check
              label="Featured"
              checked={form.featured}
              change={(v) => setForm({ ...form, featured: v })}
            />
            <Check
              label="New"
              checked={form.isNew}
              change={(v) => setForm({ ...form, isNew: v })}
            />
            <Check
              label="Sale"
              checked={form.isSale}
              change={(v) => setForm({ ...form, isSale: v })}
            />
          </div>
          {error && <p className="text-red-700 text-sm mt-4">{error}</p>}
          <button type="submit" className="btn btn-dark mt-5">
            Сохранить товар
          </button>
        </form>
      )}
      <table className="w-full text-sm text-left min-w-[800px]">
        <thead className="text-xs text-muted">
          <tr>
            {['Image', 'Name', 'Category', 'Price', 'Old Price', 'Status', 'Stock', 'Actions'].map(
              (x) => (
                <th className="py-3" key={x}>
                  {x}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => (
            <tr className="border-t" key={p.id}>
              <td className="py-3">
                <Image src={p.images[0]} alt="" width={46} height={56} />
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.oldPrice ? formatPrice(p.oldPrice) : '—'}</td>
              <td className="text-green-700">Active</td>
              <td>In stock</td>
              <td className="space-x-3">
                <button
                  onClick={() => {
                    save([...list, { ...p, id: Date.now().toString(), name: p.name + ' Copy' }]);
                    notify('product_duplicated', 'success');
                  }}
                >
                  Duplicate
                </button>
                <button
                  className="text-red-700"
                  onClick={() => {
                    save(list.filter((_, n) => n !== i));
                    notify('product_deleted', 'info');
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function T({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>;
}
function Field({
  label,
  value,
  change,
  type = 'text',
}: {
  label: string;
  value: string;
  change: (v: string) => void;
  type?: string;
}) {
  return (
    <label>
      <T>{label}</T>
      <input
        type={type}
        className="field mt-2"
        value={value}
        onChange={(e) => change(e.target.value)}
      />
    </label>
  );
}
function Check({
  label,
  checked,
  change,
}: {
  label: string;
  checked: boolean;
  change: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => change(e.target.checked)} />
      {label}
    </label>
  );
}
