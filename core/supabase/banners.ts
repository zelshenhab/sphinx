import { createClient } from './client';
import type { Banner } from '@/types';

export async function saveBanner(input: Omit<Banner, 'id'> & { id?: string }) {
  const supabase = createClient();
  const payload = {
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    image: input.image.trim(),
    cta_text: input.ctaText.trim(),
    cta_url: input.ctaUrl.trim() || '/shop',
    active: input.active,
    sort_order: input.sortOrder ?? 0,
  };
  const query = input.id
    ? supabase.from('banners').update(payload).eq('id', input.id).select('id').single()
    : supabase.from('banners').insert(payload).select('id').single();
  const { data, error } = await query;
  if (error) throw error;
  const { error: metadataError } = await supabase.from('store_settings').upsert({
    key: `banner_meta:${data.id}`,
    value: {
      titleEn: input.titleEn ?? '',
      subtitleEn: input.subtitleEn ?? '',
      mobileImage: input.mobileImage ?? '',
      ctaTextEn: input.ctaTextEn ?? '',
      location: input.location ?? 'home',
      startsAt: input.startsAt ?? '',
      endsAt: input.endsAt ?? '',
      secondCtaText: input.secondCtaText ?? '',
      secondCtaTextEn: input.secondCtaTextEn ?? '',
      secondCtaUrl: input.secondCtaUrl ?? '',
      height: input.height ?? 620,
      imagePosition: input.imagePosition ?? 'center',
      gradientOpacity: input.gradientOpacity ?? 65,
      textColor: input.textColor ?? 'white',
      textAlign: input.textAlign ?? 'left',
      imageContainsText: input.imageContainsText ?? false,
    },
  });
  if (metadataError) throw metadataError;
}

export async function deleteBanner(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
  await supabase.from('store_settings').delete().eq('key', `banner_meta:${id}`);
}
