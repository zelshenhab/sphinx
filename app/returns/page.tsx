import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';
export const metadata: Metadata = { title: 'Возврат и обмен | SPHINX' };
export default function Returns() {
  return (
    <LegalPage
      title={{ ru: 'Возврат и обмен', en: 'Returns and exchanges' }}
      intro={{
        ru: 'Мы хотим, чтобы вам было удобно покупать SPHINX онлайн.',
        en: 'We want you to shop SPHINX online with confidence.',
      }}
      sections={[
        {
          title: { ru: 'Срок возврата', en: 'Return period' },
          paragraphs: [
            {
              ru: 'Вы можете отказаться от товара до его передачи, а после получения — в течение 7 дней, если иное не требуется применимым законом.',
              en: 'You may cancel before delivery and return an item within 7 days after receipt, unless applicable law requires otherwise.',
            },
          ],
        },
        {
          title: { ru: 'Условия', en: 'Conditions' },
          items: [
            {
              ru: 'Сохранены товарный вид, ярлыки и потребительские свойства.',
              en: 'Original condition, labels and consumer properties are preserved.',
            },
            {
              ru: 'Есть подтверждение покупки; его отсутствие не лишает вас права представить другие доказательства.',
              en: 'Proof of purchase is available; if not, other evidence may be provided.',
            },
            {
              ru: 'Товар с индивидуальными свойствами может не подлежать возврату.',
              en: 'Personalized goods may not be eligible for return.',
            },
          ],
        },
        {
          title: { ru: 'Как оформить', en: 'How to request a return' },
          paragraphs: [
            {
              ru: 'Напишите в Telegram, укажите номер заказа, товар и причину. Мы сообщим адрес и способ возврата.',
              en: 'Message us on Telegram with the order number, item and reason. We will provide the return address and method.',
            },
          ],
        },
        {
          title: { ru: 'Возврат денег', en: 'Refunds' },
          paragraphs: [
            {
              ru: 'Возврат оплаты производится не позднее 10 дней со дня получения требования. Расходы на доставку возвращаемого товара могут быть удержаны в пределах, разрешённых законом.',
              en: 'Refunds are made within 10 days of the request. Return shipping costs may be deducted where permitted by law.',
            },
          ],
        },
      ]}
    />
  );
}
