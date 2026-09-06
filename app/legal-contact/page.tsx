import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';
import { TELEGRAM_USERNAME } from '@/config/site';
import { createClient } from '@/core/supabase/server';
export const metadata: Metadata = { title: 'Данные продавца | SPHINX' };
export default async function LegalContact() {
  const db = await createClient();
  const { data } = await db
    .from('store_settings')
    .select('value')
    .eq('key', 'seller_details')
    .maybeSingle();
  const sellerDetails = typeof data?.value === 'string' ? data.value.trim() : '';
  return (
    <LegalPage
      title={{ ru: 'Данные продавца', en: 'Seller information' }}
      intro={{
        ru: 'Каналы для вопросов о заказах, возвратах и персональных данных.',
        en: 'Contact channels for orders, returns and personal-data requests.',
      }}
      sections={[
        {
          title: { ru: 'Магазин', en: 'Store' },
          items: [
            { ru: 'Наименование: SPHINX', en: 'Trading name: SPHINX' },
            { ru: `Telegram: @${TELEGRAM_USERNAME}`, en: `Telegram: @${TELEGRAM_USERNAME}` },
            { ru: 'Сайт: sphinx-store.vercel.app', en: 'Website: sphinx-store.vercel.app' },
          ],
        },
        {
          title: { ru: 'Время ответа', en: 'Response time' },
          paragraphs: [
            {
              ru: 'Мы стараемся ответить в Telegram в течение 2 рабочих дней.',
              en: 'We aim to reply on Telegram within 2 business days.',
            },
          ],
        },
        {
          title: { ru: 'Реквизиты', en: 'Legal details' },
          paragraphs: [
            {
              ru:
                sellerDetails ||
                'Реквизиты продавца пока не указаны. Свяжитесь с нами перед оформлением заказа.',
              en:
                sellerDetails ||
                'Seller details have not yet been provided. Please contact us before placing an order.',
            },
          ],
        },
      ]}
    />
  );
}
