'use client';
import { useEffect, useState } from 'react';
import { TELEGRAM_USERNAME } from '@/config/site';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
import { useNotification } from '@/features/notifications';
import { loadSettings, saveSettings } from '@/core/supabase/store';
import { useCatalog } from '@/features/catalog';
const defaults: Record<string, string> = {
  brand: 'SPHINX',
  tagline: 'THE GUARDIAN',
  telegram: TELEGRAM_USERNAME,
  instagram: 'https://instagram.com/sphinx.store',
  vk: 'https://vk.com/sphinx',
  announcement: 'Бесплатная доставка от 7 000 ₽',
  currency: 'RUB ₽',
  sizes: 'XS, S, M, L, XL, XXL',
  colors: 'Black, White, Sand',
  logo: '',
  favicon: '/assets/products/cd986ef7-8736-4312-a63e-2a4375055055.png',
  free_shipping_threshold: '7000',
  delivery_estimate: '2–4 дня',
  exchange_policy: 'Обмен и возврат доступны после согласования с магазином.',
  languages: 'ru, en',
  seller_details: '',
  maintenance_mode: 'false',
  orders_enabled: 'true',
};
export default function Settings() {
  const { notify } = useNotification();
  const { refresh } = useCatalog();
  const [s, setS] = useState(defaults);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(async () => {
      const local = clientStorage.get(storageKeys.settings, defaults);
      try {
        const remote = await loadSettings(local);
        setS({
          ...remote,
          telegram: remote.telegram === 'SPHINX_STORE' ? TELEGRAM_USERNAME : remote.telegram,
        });
      } catch (error) {
        console.info('[SPHINX_SETTINGS_LOCAL_FALLBACK]', error);
        setS(local);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="admin-card max-w-4xl">
      <h2 className="display text-2xl mb-6">Настройки</h2>
      <p className="text-xs text-muted mb-6">Бренд, контакты, доставка, языки и режим работы магазина.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(s).map(([k, v]) => (
          <label className={k === 'announcement' ? 'sm:col-span-2' : ''} key={k}>
            <span className="text-xs text-muted uppercase">{k}</span>
            {(k === 'maintenance_mode' || k === 'orders_enabled') ? (
              <select className="field mt-2" value={v} onChange={(e) => setS({...s,[k]:e.target.value})}><option value="false">Выключено</option><option value="true">Включено</option></select>
            ) : (k === 'exchange_policy' || k === 'seller_details') ? (
              <textarea className="field mt-2 min-h-24" value={v} onChange={(e) => setS({...s,[k]:e.target.value})} />
            ) : (
              <input className="field mt-2" value={v} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
            )}
          </label>
        ))}
      </div>
      <button
        className="btn btn-dark mt-6"
        onClick={async () => {
          clientStorage.set(storageKeys.settings, s);
          try {
            await saveSettings(s);
            await refresh();
            setSaved(true);
            notify('settings_saved', 'success');
          } catch (error) {
            console.error('[SPHINX_SETTINGS_SAVE_ERROR]', error);
            notify(
              {
                ru: 'Не удалось сохранить настройки в Supabase',
                en: 'Could not save settings to Supabase',
              },
              'error',
            );
          }
        }}
      >
        Сохранить
      </button>
      {saved && <span className="text-sm text-green-700 ml-4">Сохранено в Supabase</span>}
    </div>
  );
}
