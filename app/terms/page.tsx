import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';
export const metadata: Metadata = { title: 'Условия использования | SPHINX' };
export default function Terms() {
  return (
    <LegalPage
      title={{ ru: 'Условия использования', en: 'Terms and conditions' }}
      intro={{
        ru: 'Используя сайт и оформляя заказ, вы соглашаетесь с этими условиями.',
        en: 'By using the site and placing an order, you agree to these terms.',
      }}
      sections={[
        {
          title: { ru: 'Заказ', en: 'Orders' },
          paragraphs: [
            {
              ru: 'Заказ считается принятым после подтверждения продавцом. Мы можем уточнить наличие, цену, адрес и способ доставки перед подтверждением.',
              en: 'An order is accepted after seller confirmation. Availability, price, address and delivery method may be confirmed before acceptance.',
            },
          ],
        },
        {
          title: { ru: 'Цены и оплата', en: 'Prices and payment' },
          paragraphs: [
            {
              ru: 'Цены указаны в рублях. Способ и срок оплаты согласовываются при подтверждении заказа.',
              en: 'Prices are shown in Russian rubles. Payment method and timing are agreed when the order is confirmed.',
            },
          ],
        },
        {
          title: { ru: 'Доставка', en: 'Delivery' },
          paragraphs: [
            {
              ru: 'Сроки и стоимость доставки зависят от города и службы доставки и сообщаются до подтверждения.',
              en: 'Delivery time and cost depend on the city and carrier and are provided before confirmation.',
            },
          ],
        },
        {
          title: { ru: 'Качество и возврат', en: 'Quality and returns' },
          paragraphs: [
            {
              ru: 'Товары должны соответствовать описанию. Порядок обмена и возврата указан на странице «Возврат и обмен».',
              en: 'Goods should match their description. The Returns and exchanges page explains the process.',
            },
          ],
        },
        {
          title: { ru: 'Интеллектуальные права', en: 'Intellectual property' },
          paragraphs: [
            {
              ru: 'Логотип, дизайн, тексты и изображения SPHINX нельзя копировать или использовать без разрешения.',
              en: 'SPHINX logos, designs, text and images may not be copied or used without permission.',
            },
          ],
        },
      ]}
    />
  );
}
