'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { getVariantImage, useCart } from '@/features/cart';
import { formatPrice, TELEGRAM_USERNAME } from '@/config/site';
import { createOrder } from '@/core/supabase/store';
import { useNotification } from '@/features/notifications';
import { useLanguage } from '@/features/i18n';
export default function Checkout() {
  const { items, total, clear } = useCart();
  const { notify } = useNotification();
  const router = useRouter();
  const { language } = useLanguage();
  const tr = (ru: string, en: string) => (language === 'en' ? en : ru);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    telegram: '',
    city: '',
    street: '',
    building: '',
    entrance: '',
    floor: '',
    apartment: '',
    comment: '',
  });
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const card = useRef<HTMLDivElement>(null);
  const fullAddress = [
    form.city,
    form.street && `${tr('ул.', 'St.')} ${form.street}`,
    form.building && `${tr('дом', 'building')} ${form.building}`,
    form.entrance && `${tr('подъезд', 'entrance')} ${form.entrance}`,
    form.floor && `${tr('этаж', 'floor')} ${form.floor}`,
    form.apartment && `${tr('кв.', 'apt.')} ${form.apartment}`,
  ]
    .filter(Boolean)
    .join(', ');
  const text = [
    '🛍 SPHINX ORDER',
    orderId ? `Order ID: ${orderId}` : '',
    '',
    `${tr('Имя', 'Name')}: ${form.name}`,
    `${tr('Телефон', 'Phone')}: ${form.phone}`,
    form.telegram ? `Telegram: ${form.telegram}` : '',
    `${tr('Адрес', 'Address')}: ${fullAddress}`,
    form.comment ? `${tr('Комментарий', 'Comment')}: ${form.comment}` : '',
    '',
    `${tr('Товары', 'Products')}:`,
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name}\n   ${tr('Количество', 'Quantity')}: ${item.quantity}\n   ${tr('Цвет', 'Color')}: ${item.color}\n   ${tr('Размер', 'Size')}: ${item.size}\n   ${tr('Цена', 'Price')}: ${formatPrice(item.product.price * item.quantity)}`,
    ),
    '',
    `${tr('Итого', 'Total')}: ${formatPrice(total)}`,
  ]
    .filter((line, index, lines) => line !== '' || lines[index - 1] !== '')
    .join('\n');
  const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
  const sendToTelegram = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    clear();
    router.push('/order-success');
  };
  const download = async () => {
    if (!card.current) return;
    const data = await toPng(card.current, { pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = data;
    a.download = 'sphinx-order.png';
    a.click();
  };
  const submitOrder = async () => {
    if (
      !items.length ||
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.city.trim() ||
      !form.street.trim() ||
      !form.building.trim() ||
      !form.apartment.trim()
    ) {
      notify('required_fields', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createOrder(
        {
          name: form.name,
          phone: form.phone,
          telegram: form.telegram,
          city: fullAddress,
          comment: form.comment,
        },
        items,
      );
      setOrderId(id);
      setReady(true);
      notify({ ru: 'Заказ сохранён', en: 'Order saved' }, 'success');
    } catch (error) {
      console.error('[SPHINX_ORDER_CREATE_ERROR]', error);
      notify(
        {
          ru: 'Не удалось сохранить заказ. Попробуйте ещё раз',
          en: 'Could not save the order. Please try again',
        },
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="container-x py-16">
      <p className="eyebrow text-brown">{tr('Заказ через Telegram', 'Telegram checkout')}</p>
      <h1 className="display text-5xl mt-3">{tr('Оформление заказа', 'Checkout')}</h1>
      <div className="grid lg:grid-cols-2 gap-12 mt-12">
        <section>
          <h2 className="display text-2xl mb-6">{tr('Контактные данные', 'Contact details')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries({
              name: tr('Имя', 'Name'),
              phone: tr('Телефон', 'Phone'),
              telegram: tr('Telegram username (необязательно)', 'Telegram username (optional)'),
            }).map(([k, l]) => (
              <input
                key={k}
                className="field"
                placeholder={l}
                value={form[k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <div className="sm:col-span-2 border-t border-black/10 pt-5 mt-1">
              <h3 className="display text-xl">{tr('Адрес доставки', 'Delivery address')}</h3>
              <p className="text-xs text-muted mt-1">
                {tr('Укажите адрес подробно', 'Enter the full address')}
              </p>
            </div>
            {Object.entries({
              city: tr('Город *', 'City *'),
              street: tr('Улица *', 'Street *'),
              building: tr('Дом *', 'Building *'),
              entrance: tr('Подъезд', 'Entrance'),
              floor: tr('Этаж', 'Floor'),
              apartment: tr('Квартира *', 'Apartment *'),
            }).map(([key, label]) => (
              <input
                key={key}
                className="field"
                placeholder={label}
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              />
            ))}
            <textarea
              className="field sm:col-span-2"
              placeholder={tr('Комментарий к заказу', 'Order comment')}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>
          <button
            disabled={
              ready ||
              submitting ||
              !items.length ||
              !form.name ||
              !form.phone ||
              !form.city ||
              !form.street ||
              !form.building ||
              !form.apartment
            }
            onClick={() => void submitOrder()}
            className="btn btn-dark mt-6 disabled:opacity-40"
          >
            {submitting
              ? tr('Сохранение...', 'Saving...')
              : tr('Оформить заказ в Telegram', 'Prepare Telegram order')}
          </button>
          {ready && (
            <div className="bg-sand p-6 mt-7">
              <h2 className="display text-3xl">
                {tr('Заказ почти готов!', 'Your order is almost ready!')}
              </h2>
              {orderId && <p className="text-xs text-muted mt-2">Order ID: {orderId}</p>}
              <p className="text-sm leading-7 mt-3">
                {tr('1. Нажмите «Отправить заказ»', '1. Click “Send order”')}
                <br />
                {tr(
                  '2. Проверьте готовое сообщение и нажмите Send',
                  '2. Review the prepared message and press Send',
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <button className="btn btn-dark" onClick={download}>
                  {tr('Скачать заказ', 'Download order')}
                </button>
                <button
                  className="btn bg-white"
                  onClick={() => navigator.clipboard.writeText(text)}
                >
                  {tr('Скопировать заказ', 'Copy order')}
                </button>
                <button className="btn border border-ink" onClick={sendToTelegram}>
                  {tr('Отправить заказ', 'Send order')}
                </button>
              </div>
            </div>
          )}
        </section>
        <section>
          <h2 className="display text-2xl mb-6">{tr('Ваш заказ', 'Your order')}</h2>
          <div ref={card} className="bg-white p-4 sm:p-7 border border-black/10">
            <div className="flex justify-between mb-7">
              <b className="display text-2xl tracking-widest">SPHINX</b>
              <span className="eyebrow">{tr('Карточка заказа', 'Order card')}</span>
            </div>
            {items.map((x, i) => (
              <div key={i} className="flex gap-4 border-t py-4">
                <Image
                  src={getVariantImage(x.product, x.color)}
                  alt=""
                  width={70}
                  height={85}
                  className="bg-sand object-cover"
                />
                <div className="text-sm flex-1">
                  <b>
                    {x.quantity} × {x.product.name}
                  </b>
                  <p className="text-muted mt-2">
                    {x.color} · {x.size}
                  </p>
                </div>
                <b className="text-sm">{formatPrice(x.product.price * x.quantity)}</b>
              </div>
            ))}
            <div className="border-t pt-5 flex justify-between text-lg">
              <b>{tr('Итого', 'Total')}</b>
              <b>{formatPrice(total)}</b>
            </div>
            {ready && (
              <div className="text-xs text-muted mt-5">
                {form.name} · {fullAddress} · {form.phone}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
