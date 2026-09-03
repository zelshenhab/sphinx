'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  createProduct,
  deleteProduct,
  listProducts,
  products as seed,
  uploadProductImage,
  updateProduct,
  useCatalog,
} from '@/features/catalog';
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
  stock: '20',
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
function distributeStock(sizes: string[], total = 20) {
  const safeTotal = Math.max(0, Math.floor(total));
  return Object.fromEntries(
    sizes.map((size, index) => [
      size,
      Math.floor(safeTotal / sizes.length) + (index < safeTotal % sizes.length ? 1 : 0),
    ]),
  );
}
const variantKey = (color: string, size: string) => `${color}::${size}`;
function distributeVariantStock(
  colors: string[],
  sizes: string[],
  total = 20,
  sizeTotals?: Record<string, number>,
) {
  const totals = sizeTotals ?? distributeStock(sizes, total);
  return Object.fromEntries(
    sizes.flatMap((size) => {
      const sizeTotal = totals[size] ?? 0;
      return colors.map((color, index) => [
        variantKey(color, size),
        Math.floor(sizeTotal / colors.length) + (index < sizeTotal % colors.length ? 1 : 0),
      ]);
    }),
  );
}
export default function Products() {
  const { notify } = useNotification();
  const { categories, refresh, settings } = useCatalog();
  const [list, setList] = useState<Product[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [colorImages, setColorImages] = useState<Record<string, string[]>>({});
  const [variantStock, setVariantStock] = useState<Record<string, number>>(
    distributeVariantStock(
      blank.colors.split(',').map((color) => color.trim()),
      blank.sizes.split(',').map((size) => size.trim()),
      Number(blank.stock),
    ),
  );
  const [galleryColor, setGalleryColor] = useState('Black');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const selectedColors = form.colors
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean);
  const colorOptions = Array.from(
    new Set([
      ...(settings.colors || blank.colors)
        .split(',')
        .map((color) => color.trim())
        .filter(Boolean),
      ...selectedColors,
    ]),
  );
  const selectedSizes = form.sizes
    .split(',')
    .map((size) => size.trim())
    .filter(Boolean);
  const sizeOptions = Array.from(
    new Set([
      ...(settings.sizes || blank.sizes)
        .split(',')
        .map((size) => size.trim())
        .filter(Boolean),
      ...selectedSizes,
    ]),
  );
  const toggleSize = (size: string) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((item) => item !== size)
      : [...selectedSizes, size];
    setForm({ ...form, sizes: next.join(', ') });
  };
  const toggleColor = (color: string) => {
    const next = selectedColors.includes(color)
      ? selectedColors.filter((item) => item !== color)
      : [...selectedColors, color];
    setForm({ ...form, colors: next.join(', ') });
  };
  useEffect(() => {
    const id = window.setTimeout(async () => {
      const local = load();
      if (local.length) setList(local);
      try {
        const remote = await listProducts();
        if (remote.length) setList(remote);
      } catch (loadError) {
        console.info('[SPHINX_ADMIN_LOCAL_FALLBACK]', loadError);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  const save = (x: Product[]) => {
    setList(x);
    clientStorage.set(storageKeys.products, x);
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.slug.trim() ||
      !Number(form.price) ||
      !selectedSizes.length ||
      !selectedColors.length
    ) {
      setError('اكتب اسم المنتج وSlug والسعر واختار مقاس ولون واحد على الأقل.');
      notify('required_fields', 'warning');
      return;
    }
    const existingProduct = editingId ? list.find((item) => item.id === editingId) : undefined;
    const normalizedSizeStock = Object.fromEntries(
      selectedSizes.map((size) => [
        size,
        selectedColors.reduce(
          (total, color) =>
            total + Math.max(0, Math.floor(Number(variantStock[variantKey(color, size)]) || 0)),
          0,
        ),
      ]),
    );
    const normalizedVariantStock = Object.fromEntries(
      selectedColors.flatMap((color) =>
        selectedSizes.map((size) => [
          variantKey(color, size),
          Math.max(0, Math.floor(Number(variantStock[variantKey(color, size)]) || 0)),
        ]),
      ),
    );
    const totalStock = Object.values(normalizedSizeStock).reduce((total, stock) => total + stock, 0);
    const p: Product = {
      id: editingId ?? form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      sizeStock: normalizedSizeStock,
      variantStock: normalizedVariantStock,
      stockQuantity: totalStock,
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
      images: [form.image || blank.image, ...(existingProduct?.images.slice(1) ?? [])],
      colorImages,
      type: form.type,
      featured: form.featured,
      isNew: form.isNew,
      isSale: form.isSale,
    };
    try {
      const remoteProduct = editingId ? await updateProduct(p) : await createProduct(p);
      save(
        editingId
          ? list.map((item) => (item.id === editingId ? remoteProduct : item))
          : [remoteProduct, ...list],
      );
      await refresh();
    } catch (createError) {
      console.error('[SPHINX_PRODUCT_CREATE_ERROR]', createError);
      save(editingId ? list.map((item) => (item.id === editingId ? p : item)) : [p, ...list]);
      notify(
        {
          ru: 'Supabase недоступен — товар сохранён локально',
          en: 'Supabase unavailable — product saved locally',
        },
        'warning',
      );
    }
    setForm(blank);
    setColorImages({});
    setVariantStock(
      distributeVariantStock(
        blank.colors.split(',').map((color) => color.trim()),
        blank.sizes.split(',').map((size) => size.trim()),
        20,
      ),
    );
    setEditingId(null);
    setError('');
    setOpen(false);
    notify('product_created', 'success');
  };
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const image = await uploadProductImage(file);
      setForm((current) => ({ ...current, image }));
      notify({ ru: 'Изображение загружено', en: 'Image uploaded' }, 'success');
    } catch (uploadError) {
      console.error('[SPHINX_IMAGE_UPLOAD_ERROR]', uploadError);
      notify({ ru: 'Не удалось загрузить изображение', en: 'Could not upload image' }, 'error');
    } finally {
      setUploading(false);
    }
  };
  const uploadGalleryImages = async (files: FileList) => {
    if (!galleryColor) return;
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadProductImage));
      setColorImages((current) => ({
        ...current,
        [galleryColor]: [...(current[galleryColor] ?? []), ...urls].slice(0, 4),
      }));
      notify({ ru: 'Изображения цвета загружены', en: 'Color images uploaded' }, 'success');
    } catch (uploadError) {
      console.error('[SPHINX_COLOR_IMAGES_UPLOAD_ERROR]', uploadError);
      notify(
        { ru: 'Не удалось загрузить изображения цвета', en: 'Could not upload color images' },
        'error',
      );
    } finally {
      setGalleryUploading(false);
    }
  };
  return (
    <div className="admin-card overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="display text-2xl">Товары</h2>
          <p className="text-xs text-muted mt-1">{list.length} товаров · сохранение в браузере</p>
        </div>
        <button
          onClick={() => {
            const next = !open;
            if (next)
              setForm({
                ...blank,
                sizes: settings.sizes || blank.sizes,
                colors: settings.colors || blank.colors,
              });
            if (next) {
              setEditingId(null);
              setColorImages({});
              const sizes = (settings.sizes || blank.sizes)
                .split(',')
                .map((size) => size.trim())
                .filter(Boolean);
              const colors = (settings.colors || blank.colors)
                .split(',')
                .map((color) => color.trim())
                .filter(Boolean);
              setVariantStock(distributeVariantStock(colors, sizes, Number(blank.stock)));
              setGalleryColor((settings.colors || blank.colors).split(',')[0].trim());
            }
            setOpen(next);
          }}
          className="btn btn-dark"
        >
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
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
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
            <div className="md:col-span-2 xl:col-span-2">
              <T>Available colors</T>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((color) => {
                  const selected = selectedColors.includes(color);
                  return (
                    <label
                      key={color}
                      className={`cursor-pointer flex items-center gap-2 border px-4 py-3 text-sm transition ${selected ? 'bg-ink text-white border-ink' : 'bg-white border-black/15'}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => toggleColor(color)}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </label>
                  );
                })}
              </div>
              {!selectedColors.length && (
                <p className="text-xs text-red-700 mt-2">Выберите хотя бы один цвет</p>
              )}
            </div>
            <div className="md:col-span-2 xl:col-span-3 border border-black/10 bg-white p-4">
              <T>Images for each color (up to 4)</T>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedColors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setGalleryColor(color)}
                    className={`px-4 py-2 text-xs border ${galleryColor === color ? 'bg-ink text-white border-ink' : 'border-black/15'}`}
                  >
                    {color} · {colorImages[color]?.length ?? 0}/4
                  </button>
                ))}
              </div>
              {galleryColor && selectedColors.includes(galleryColor) && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-3">
                    {(colorImages[galleryColor] ?? []).map((url, imageIndex) => (
                      <div key={`${url}-${imageIndex}`} className="relative w-20 h-24 bg-sand">
                        <Image src={url} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={() =>
                            setColorImages((current) => ({
                              ...current,
                              [galleryColor]: current[galleryColor].filter(
                                (_, index) => index !== imageIndex,
                              ),
                            }))
                          }
                          className="absolute top-1 right-1 bg-white text-red-700 w-6 h-6"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    className="field mt-3"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    disabled={galleryUploading || (colorImages[galleryColor]?.length ?? 0) >= 4}
                    onChange={(event) => {
                      if (event.target.files?.length) void uploadGalleryImages(event.target.files);
                    }}
                  />
                  <p className="text-[11px] text-muted mt-2">
                    {galleryUploading ? 'Uploading...' : `Upload 3–4 images for ${galleryColor}`}
                  </p>
                </div>
              )}
            </div>
            <div className="md:col-span-2 xl:col-span-2">
              <T>Available sizes</T>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizeOptions.map((size) => {
                  const selected = selectedSizes.includes(size);
                  return (
                    <label
                      key={size}
                      className={`cursor-pointer min-w-12 text-center border px-4 py-3 text-sm transition ${selected ? 'bg-ink text-white border-ink' : 'bg-white border-black/15'}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => toggleSize(size)}
                      />
                      {size}
                    </label>
                  );
                })}
              </div>
              {!selectedSizes.length && (
                <p className="text-xs text-red-700 mt-2">Выберите хотя бы один размер</p>
              )}
              {selectedSizes.length > 0 && selectedColors.length > 0 && (
                <div className="mt-5 overflow-x-auto border border-black/10 bg-white p-4">
                  <p className="text-sm font-medium mb-3">Stock by color and size</p>
                  <table className="w-full text-xs min-w-[560px]">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Color</th>
                        {selectedSizes.map((size) => <th key={size} className="p-2">{size}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedColors.map((color) => (
                        <tr key={color} className="border-t">
                          <th className="text-left p-2">{color}</th>
                          {selectedSizes.map((size) => {
                            const key = variantKey(color, size);
                            return (
                              <td key={key} className="p-2">
                                <input
                                  aria-label={`Stock for ${color} ${size}`}
                                  className="field min-w-16 text-center"
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={variantStock[key] ?? 0}
                                  onChange={(event) =>
                                    setVariantStock((current) => ({
                                      ...current,
                                      [key]: Math.max(0, Number(event.target.value)),
                                    }))
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <Field
              label="Image path"
              value={form.image}
              change={(v) => setForm({ ...form, image: v })}
            />
            <label>
              <T>{uploading ? 'Uploading...' : 'Upload image'}</T>
              <input
                className="field mt-2"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadImage(file);
                }}
              />
            </label>
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
            {editingId ? 'Обновить товар' : 'Сохранить товар'}
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
              <td
                className={
                  p.stockQuantity === 0
                    ? 'text-red-700'
                    : p.stockQuantity !== undefined && p.stockQuantity <= 10
                      ? 'text-amber-700'
                      : 'text-green-700'
                }
              >
                {p.stockQuantity ?? 20} pcs
              </td>
              <td className="space-x-3">
                <button
                  onClick={() => {
                    setEditingId(p.id);
                    setColorImages(p.colorImages ?? {});
                    setVariantStock(
                      p.variantStock ??
                        distributeVariantStock(
                          p.colors,
                          p.sizes,
                          p.stockQuantity ?? 20,
                          p.sizeStock,
                        ),
                    );
                    setGalleryColor(p.colors[0] ?? 'Black');
                    setForm({
                      name: p.name,
                      slug: p.slug,
                      category: p.category,
                      price: String(p.price),
                      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
                      stock: String(p.stockQuantity ?? 20),
                      description: p.description,
                      material: p.material,
                      gsm: p.gsm || '',
                      fit: p.fit,
                      colors: p.colors.join(', '),
                      sizes: p.sizes.join(', '),
                      image: p.images[0] || blank.image,
                      type: p.type,
                      featured: p.featured,
                      isNew: p.isNew ?? false,
                      isSale: p.isSale ?? false,
                    });
                    setOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    const copy = {
                      ...p,
                      id: Date.now().toString(),
                      name: p.name + ' Copy',
                      slug: `${p.slug}-copy-${Date.now()}`,
                    };
                    try {
                      const remoteCopy = await createProduct(copy);
                      save([...list, remoteCopy]);
                      await refresh();
                    } catch {
                      save([...list, copy]);
                    }
                    notify('product_duplicated', 'success');
                  }}
                >
                  Duplicate
                </button>
                <button
                  className="text-red-700"
                  onClick={async () => {
                    try {
                      await deleteProduct(p.id);
                      await refresh();
                    } catch (deleteError) {
                      console.info('[SPHINX_PRODUCT_DELETE_LOCAL_ONLY]', deleteError);
                    }
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
