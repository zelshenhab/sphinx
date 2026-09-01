'use client';
import { useEffect, useState } from 'react';
import { TELEGRAM_USERNAME } from '@/config/site';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
import { useNotification } from '@/features/notifications';
import { loadSettings, saveSettings } from '@/core/supabase/store';
const defaults = {
  brand: 'SPHINX',
  tagline: 'THE GUARDIAN',
  telegram: TELEGRAM_USERNAME,
  instagram: 'https://instagram.com/sphinx.wear',
  vk: 'https://vk.com/sphinx',
  announcement: 'Бесплатная доставка от 7 000 ₽',
  currency: 'RUB ₽',
};
export default function Settings() {
  const { notify } = useNotification();
  const [s, setS] = useState(defaults);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(async () => {
      const local = clientStorage.get(storageKeys.settings, defaults);
      try {
        setS(await loadSettings(local));
      } catch (error) {
        console.info('[SPHINX_SETTINGS_LOCAL_FALLBACK]', error);
        setS(local);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="admin-card max-w-2xl">
      <h2 className="display text-2xl mb-6">Настройки</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(s).map(([k, v]) => (
          <label className={k === 'announcement' ? 'sm:col-span-2' : ''} key={k}>
            <span className="text-xs text-muted uppercase">{k}</span>
            <input
              className="field mt-2"
              value={v}
              onChange={(e) => setS({ ...s, [k]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <button
        className="btn btn-dark mt-6"
        onClick={async () => {
          clientStorage.set(storageKeys.settings, s);
          try {
            await saveSettings(s);
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
