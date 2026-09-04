import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';
export const metadata: Metadata = { title: 'Политика конфиденциальности | SPHINX' };
export default function Privacy() {
  return (
    <LegalPage
      title={{ ru: 'Политика конфиденциальности', en: 'Privacy policy' }}
      intro={{
        ru: 'Мы бережно относимся к вашим данным и используем их только для работы магазина и выполнения заказов.',
        en: 'We handle your data carefully and use it only to operate the store and fulfil orders.',
      }}
      sections={[
        {
          title: { ru: 'Какие данные мы собираем', en: 'Data we collect' },
          items: [
            {
              ru: 'Имя, телефон, Telegram, город и комментарий к заказу.',
              en: 'Name, phone, Telegram, city and order comments.',
            },
            {
              ru: 'Состав заказа: товары, цвета, размеры и количество.',
              en: 'Order contents: products, colors, sizes and quantities.',
            },
            {
              ru: 'Технические данные, необходимые для безопасности и работы сайта.',
              en: 'Technical data needed for security and site operation.',
            },
          ],
        },
        {
          title: { ru: 'Зачем нужны данные', en: 'Why we use data' },
          items: [
            {
              ru: 'Принятие, подтверждение, доставка и возврат заказов.',
              en: 'Accepting, confirming, delivering and returning orders.',
            },
            {
              ru: 'Обработка обращений и защита от злоупотреблений.',
              en: 'Handling enquiries and preventing abuse.',
            },
          ],
        },
        {
          title: { ru: 'Хранение и передача', en: 'Storage and sharing' },
          paragraphs: [
            {
              ru: 'Данные хранятся с использованием Supabase и Vercel. Мы не продаём личные данные. Они могут быть переданы службам доставки только в объёме, нужном для выполнения заказа.',
              en: 'Data is stored using Supabase and Vercel. We do not sell personal data. It may be shared with delivery providers only as needed to fulfil an order.',
            },
          ],
        },
        {
          title: { ru: 'Ваши права', en: 'Your rights' },
          paragraphs: [
            {
              ru: 'Вы можете запросить доступ, исправление или удаление ваших данных, написав нам в Telegram.',
              en: 'You may request access, correction or deletion of your data by contacting us on Telegram.',
            },
          ],
        },
      ]}
    />
  );
}
