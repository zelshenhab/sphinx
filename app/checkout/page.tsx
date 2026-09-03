'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import { useCart } from '@/features/cart';
import { formatPrice, TELEGRAM_USERNAME } from '@/config/site';
import { createOrder } from '@/core/supabase/store';
import { useNotification } from '@/features/notifications';
export default function Checkout() {
  const { items, total } = useCart();
  const { notify } = useNotification();
  const [form, setForm] = useState({ name: '', phone: '', telegram: '', city: '', comment: '' });
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const card = useRef<HTMLDivElement>(null);
  const text = [
    '🛍 SPHINX ORDER',
    orderId ? `Order ID: ${orderId}` : '',
    '',
    `Имя: ${form.name}`,
    `Телефон: ${form.phone}`,
    form.telegram ? `Telegram: ${form.telegram}` : '',
    `Город: ${form.city}`,
    form.comment ? `Комментарий: ${form.comment}` : '',
    '',
    'Товары:',
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name}\n   Количество: ${item.quantity}\n   Цвет: ${item.color}\n   Размер: ${item.size}\n   Цена: ${formatPrice(item.product.price * item.quantity)}`,
    ),
    '',
    `Итого: ${formatPrice(total)}`,
  ]
    .filter((line, index, lines) => line !== '' || lines[index - 1] !== '')
    .join('\n');
  const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
  const download = async () => {
    if (!card.current) return;
    const data = await toPng(card.current, { pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = data;
    a.download = 'sphinx-order.png';
    a.click();
  };
  const submitOrder = async () => {
    if (!items.length || !form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      notify('required_fields', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createOrder(form, items);
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
      <p className="eyebrow text-brown">Заказ через Telegram</p>
      <h1 className="display text-5xl mt-3">Оформление заказа</h1>
      <div className="grid lg:grid-cols-2 gap-12 mt-12">
        <section>
          <h2 className="display text-2xl mb-6">Контактные данные</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries({
              name: 'Имя',
              phone: 'Телефон',
              telegram: 'Telegram username (необязательно)',
              city: 'Город',
            }).map(([k, l]) => (
              <input
                key={k}
                className="field"
                placeholder={l}
                value={form[k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <textarea
              className="field sm:col-span-2"
              placeholder="Комментарий к доставке"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>
          <button
            disabled={
              ready || submitting || !items.length || !form.name || !form.phone || !form.city
            }
            onClick={() => void submitOrder()}
            className="btn btn-dark mt-6 disabled:opacity-40"
          >
            {submitting ? 'Сохранение...' : 'Оформить заказ в Telegram'}
          </button>
          {ready && (
            <div className="bg-sand p-6 mt-7">
              <h2 className="display text-3xl">Заказ почти готов!</h2>
              {orderId && <p className="text-xs text-muted mt-2">Order ID: {orderId}</p>}
              <p className="text-sm leading-7 mt-3">
                1. Нажмите «Отправить заказ»
                <br />
                2. Проверьте готовое сообщение и нажмите Send
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <button className="btn btn-dark" onClick={download}>
                  Скачать заказ
                </button>
                <button
                  className="btn bg-white"
                  onClick={() => navigator.clipboard.writeText(text)}
                >
                  Скопировать заказ
                </button>
                <a
                  className="btn border border-ink"
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Отправить заказ
                </a>
              </div>
            </div>
          )}
        </section>
        <section>
          <h2 className="display text-2xl mb-6">Ваш заказ</h2>
          <div ref={card} className="bg-white p-7 border border-black/10">
            <div className="flex justify-between mb-7">
              <b className="display text-2xl tracking-widest">SPHINX</b>
              <span className="eyebrow">Карточка заказа</span>
            </div>
            {items.map((x, i) => (
              <div key={i} className="flex gap-4 border-t py-4">
                <Image
                  src={x.product.images[0]}
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
              <b>Итого</b>
              <b>{formatPrice(total)}</b>
            </div>
            {ready && (
              <div className="text-xs text-muted mt-5">
                {form.name} · {form.city} · {form.phone}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
