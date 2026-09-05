'use client';

import { useState } from 'react';
import Image from 'next/image';
import { deleteBanner, saveBanner } from '@/core/supabase/banners';
import { uploadAdminImage } from '@/core/supabase/admin-content';
import { useCatalog } from '@/features/catalog';
import { useNotification } from '@/features/notifications';
import type { Banner } from '@/types';

type BannerDraft = Omit<Banner, 'id'>;
const emptyBanner: BannerDraft = {
  title: '',
  titleEn: '',
  subtitle: '',
  subtitleEn: '',
  image: '',
  mobileImage: '',
  ctaText: '',
  ctaTextEn: '',
  ctaUrl: '/shop',
  secondCtaText: '', secondCtaTextEn: '', secondCtaUrl: '',
  height: 620, imagePosition: 'center', gradientOpacity: 65,
  textColor: 'white', textAlign: 'left', imageContainsText: false,
  location: 'home',
  startsAt: '',
  endsAt: '',
  sortOrder: 0,
  active: true,
};

export default function BannersPage() {
  const { banners, refresh } = useCatalog();
  const { notify } = useNotification();
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<BannerDraft>(emptyBanner);
  const [uploading, setUploading] = useState<'desktop' | 'mobile' | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const selected = banners.find((banner) => banner.id === editing);
  const open = (id: string | 'new') => {
    const banner = banners.find((item) => item.id === id);
    setDraft(
      banner
        ? {
            title: banner.title,
            titleEn: banner.titleEn ?? '',
            subtitle: banner.subtitle,
            subtitleEn: banner.subtitleEn ?? '',
            image: banner.image,
            mobileImage: banner.mobileImage ?? '',
            ctaText: banner.ctaText,
            ctaTextEn: banner.ctaTextEn ?? '',
            ctaUrl: banner.ctaUrl,
            secondCtaText: banner.secondCtaText ?? '', secondCtaTextEn: banner.secondCtaTextEn ?? '', secondCtaUrl: banner.secondCtaUrl ?? '',
            height: banner.height ?? 620, imagePosition: banner.imagePosition ?? 'center', gradientOpacity: banner.gradientOpacity ?? 65,
            textColor: banner.textColor ?? 'white', textAlign: banner.textAlign ?? 'left', imageContainsText: banner.imageContainsText ?? false,
            location: banner.location ?? 'home',
            startsAt: banner.startsAt ?? '',
            endsAt: banner.endsAt ?? '',
            sortOrder: banner.sortOrder ?? 0,
            active: banner.active,
          }
        : { ...emptyBanner, sortOrder: banners.length },
    );
    setEditing(id);
  };
  const upload = async (file: File, target: 'desktop' | 'mobile') => {
    setUploading(target);
    try {
      const image = await uploadAdminImage(file);
      setDraft((current) => ({
        ...current,
        [target === 'desktop' ? 'image' : 'mobileImage']: image,
      }));
      notify({ ru: 'Изображение загружено', en: 'Image uploaded' }, 'success');
    } catch (error) {
      console.error('[SPHINX_BANNER_IMAGE_ERROR]', error);
      notify({ ru: 'Не удалось загрузить изображение', en: 'Could not upload image' }, 'error');
    } finally {
      setUploading(null);
    }
  };
  const save = async () => {
    if (!draft.image.trim()) {
      return notify(
        { ru: 'Добавьте изображение баннера', en: 'Add a banner image' },
        'warning',
      );
    }
    try {
      await saveBanner({ id: selected?.id, ...draft });
      await refresh();
      setEditing(null);
      notify({ ru: 'Баннер сохранён', en: 'Banner saved' }, 'success');
    } catch (error) {
      console.error('[SPHINX_BANNER_SAVE_ERROR]', error);
      notify({ ru: 'Не удалось сохранить баннер', en: 'Could not save banner' }, 'error');
    }
  };
  return (
    <div className="admin-card">
      <div className="flex justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="display text-2xl">Banners</h2>
          <p className="text-xs text-muted mt-1">Управление баннерами сайта</p>
        </div>
        <button className="btn btn-dark" onClick={() => open('new')}>
          Добавить
        </button>
      </div>
      {editing && (
        <div className="bg-sand/50 border border-black/10 p-4 sm:p-5 mb-7">
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Title (optional)"
              value={draft.title}
              change={(title) => setDraft({ ...draft, title })}
            />
            <Field
              label="English title"
              value={draft.titleEn ?? ''}
              change={(titleEn) => setDraft({ ...draft, titleEn })}
            />
            <Field
              label="Subtitle"
              value={draft.subtitle}
              change={(subtitle) => setDraft({ ...draft, subtitle })}
            />
            <Field
              label="English subtitle"
              value={draft.subtitleEn ?? ''}
              change={(subtitleEn) => setDraft({ ...draft, subtitleEn })}
            />
            <Field
              label="Button text"
              value={draft.ctaText}
              change={(ctaText) => setDraft({ ...draft, ctaText })}
            />
            <Field
              label="English button text"
              value={draft.ctaTextEn ?? ''}
              change={(ctaTextEn) => setDraft({ ...draft, ctaTextEn })}
            />
            <Field
              label="Button URL"
              value={draft.ctaUrl}
              change={(ctaUrl) => setDraft({ ...draft, ctaUrl })}
            />
            <Field label="Second button text (optional)" value={draft.secondCtaText ?? ''} change={(secondCtaText) => setDraft({...draft,secondCtaText})} />
            <Field label="English second button" value={draft.secondCtaTextEn ?? ''} change={(secondCtaTextEn) => setDraft({...draft,secondCtaTextEn})} />
            <Field label="Second button URL" value={draft.secondCtaUrl ?? ''} change={(secondCtaUrl) => setDraft({...draft,secondCtaUrl})} />
            <Field label="Height (px)" type="number" value={String(draft.height ?? 620)} change={(height) => setDraft({...draft,height:Math.max(240,Number(height))})} />
            <label><Label>Image position</Label><select className="field mt-2" value={draft.imagePosition} onChange={(e)=>setDraft({...draft,imagePosition:e.target.value as Banner['imagePosition']})}><option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option></select></label>
            <label><Label>Text position</Label><select className="field mt-2" value={draft.textAlign} onChange={(e)=>setDraft({...draft,textAlign:e.target.value as Banner['textAlign']})}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
            <label><Label>Text color</Label><select className="field mt-2" value={draft.textColor} onChange={(e)=>setDraft({...draft,textColor:e.target.value as Banner['textColor']})}><option value="white">White</option><option value="dark">Dark</option></select></label>
            <label><Label>Gradient: {draft.gradientOpacity}%</Label><input type="range" min="0" max="100" className="w-full mt-4 accent-black" value={draft.gradientOpacity} onChange={(e)=>setDraft({...draft,gradientOpacity:Number(e.target.value)})} /></label>
            <label className="flex gap-3 items-center mt-6"><input type="checkbox" checked={draft.imageContainsText} onChange={(e)=>setDraft({...draft,imageContainsText:e.target.checked})} />Image already contains text</label>
            <label>
              <Label>Location</Label>
              <select
                className="field mt-2"
                value={draft.location}
                onChange={(event) =>
                  setDraft({ ...draft, location: event.target.value as 'home' | 'shop' })
                }
              >
                <option value="home">Home</option>
                <option value="shop">Shop</option>
              </select>
            </label>
            <Field
              label="Start date (optional)"
              type="datetime-local"
              value={draft.startsAt ?? ''}
              change={(startsAt) => setDraft({ ...draft, startsAt })}
            />
            <Field
              label="End date (optional)"
              type="datetime-local"
              value={draft.endsAt ?? ''}
              change={(endsAt) => setDraft({ ...draft, endsAt })}
            />
            <Field
              label="Order"
              type="number"
              value={String(draft.sortOrder ?? 0)}
              change={(sortOrder) =>
                setDraft({ ...draft, sortOrder: Math.max(0, Number(sortOrder)) })
              }
            />
            <label className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
              />
              Active
            </label>
            <ImageInput
              label="Desktop image *"
              value={draft.image}
              uploading={uploading === 'desktop'}
              change={(image) => setDraft({ ...draft, image })}
              upload={(file) => void upload(file, 'desktop')}
            />
            <ImageInput
              label="Mobile image"
              value={draft.mobileImage ?? ''}
              uploading={uploading === 'mobile'}
              change={(mobileImage) => setDraft({ ...draft, mobileImage })}
              upload={(file) => void upload(file, 'mobile')}
            />
          </div>
          {draft.image && (
            <div className="mt-5">
            <div className="flex gap-2 mb-3"><button onClick={() => setPreviewDevice('desktop')} className={`px-4 py-2 text-xs border ${previewDevice === 'desktop' ? 'bg-ink text-white' : ''}`}>Desktop</button><button onClick={() => setPreviewDevice('mobile')} className={`px-4 py-2 text-xs border ${previewDevice === 'mobile' ? 'bg-ink text-white' : ''}`}>Mobile</button></div>
            <div className={`relative overflow-hidden bg-ink text-white transition-all ${previewDevice === 'mobile' ? 'max-w-xs mx-auto aspect-[4/5]' : 'aspect-[16/6]'}`}>
              <Image
                src={previewDevice === 'mobile' && draft.mobileImage ? draft.mobileImage : draft.image}
                alt="Banner preview"
                fill
                style={{objectPosition:draft.imagePosition ?? 'center'}}
                className={`object-cover ${draft.imageContainsText ? '' : 'opacity-70'}`}
              />
              {!draft.imageContainsText && <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" style={{opacity:(draft.gradientOpacity ?? 65)/100}} />}
              <div className={`absolute inset-0 flex flex-col justify-end p-5 sm:p-8 ${draft.textAlign === 'center' ? 'text-center items-center' : draft.textAlign === 'right' ? 'text-right items-end' : 'text-left items-start'} ${draft.textColor === 'dark' ? 'text-ink' : 'text-white'}`}>
                {draft.subtitle && <p className="text-xs tracking-widest uppercase">{draft.subtitle}</p>}
                {draft.title && <p className="display text-3xl sm:text-5xl mt-2">{draft.title}</p>}
                {draft.ctaText && (
                  <span className="mt-4 border border-white w-fit px-4 py-2 text-xs">
                    {draft.ctaText}
                  </span>
                )}
              </div>
            </div>
            </div>
          )}
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
      <div className="space-y-3">
        {[...banners]
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((banner) => (
            <div
              key={banner.id}
              className="border p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-28 h-16 shrink-0 bg-sand overflow-hidden">
                  {banner.image && (
                    <Image src={banner.image} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <b className="block truncate">{banner.title || 'Image-only banner'}</b>
                  <p className="text-xs text-muted mt-1">
                    {banner.location ?? 'home'} · {banner.active ? 'Active' : 'Hidden'} · Order{' '}
                    {banner.sortOrder ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-sm shrink-0">
                <button onClick={() => open(banner.id)}>Edit</button>
                <button
                  className="text-red-700"
                  onClick={async () => {
                    if (!window.confirm('Удалить этот баннер?')) return;
                    await deleteBanner(banner.id);
                    await refresh();
                    notify({ ru: 'Баннер удалён', en: 'Banner deleted' }, 'info');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        {!banners.length && <p className="py-10 text-center text-muted">Баннеров пока нет</p>}
      </div>
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs text-muted">{children}</span>;
}
function Field({
  label,
  value,
  change,
  type = 'text',
}: {
  label: string;
  value: string;
  change: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <Label>{label}</Label>
      <input
        className="field mt-2"
        type={type}
        value={value}
        onChange={(event) => change(event.target.value)}
      />
    </label>
  );
}
function ImageInput({
  label,
  value,
  change,
  upload,
  uploading,
}: {
  label: string;
  value: string;
  change: (value: string) => void;
  upload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <label>
      <Label>{label}</Label>
      <input
        className="field mt-2"
        value={value}
        onChange={(event) => change(event.target.value)}
      />
      <input
        className="block w-full text-xs mt-2"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
      />
    </label>
  );
}
