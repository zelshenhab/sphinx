'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useLanguage } from '@/features/i18n';

export default function OrderSuccessPage() {
  const { language } = useLanguage();
  const english = language === 'en';
  const [order, setOrder] = useState<{
    reference: string;
    customer: string;
    total: number;
    items: { name: string; color: string; size: string; quantity: number; image: string }[];
  } | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
    try {
      const saved = sessionStorage.getItem('sphinx_last_order');
      if (saved) setOrder(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem('sphinx_last_order');
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="container-x py-20 sm:py-28 min-h-[65vh] grid place-items-center">
      <section className="w-full max-w-2xl bg-white border border-black/10 text-center px-5 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto w-16 h-16 rounded-full bg-ink text-white grid place-items-center">
          <Check size={30} strokeWidth={1.7} />
        </div>
        <p className="eyebrow text-brown mt-7">SPHINX</p>
        <h1 className="display text-4xl sm:text-5xl mt-4">
          {english ? 'Your order has been received' : 'Ваш заказ принят'}
        </h1>
        {order?.reference && <p className="inline-block mt-5 border border-gold/30 bg-sand px-5 py-2 text-sm font-semibold">{english ? 'Order number' : 'Номер заказа'}: {order.reference}</p>}
        <p className="text-muted leading-7 mt-6 max-w-lg mx-auto">
          {english
            ? 'Thank you for your order. We will contact you as soon as possible to confirm payment and delivery details.'
            : 'Спасибо за заказ. Мы свяжемся с вами в ближайшее время, чтобы подтвердить оплату и детали доставки.'}
        </p>
        <p className="text-xs text-muted mt-4">
          {english
            ? 'Please keep the Telegram conversation open so we can reach you.'
            : 'Пожалуйста, сохраните переписку в Telegram, чтобы мы могли с вами связаться.'}
        </p>
        {order && order.items.length > 0 && (
          <details className="text-left mt-7 border border-black/10 bg-ivory p-4">
            <summary className="cursor-pointer text-sm font-medium">{english ? 'Review your order' : 'Посмотреть заказ'}</summary>
            <div className="mt-4 divide-y divide-black/10">
              {order.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex gap-3 py-3 first:pt-0">
                  <Image src={item.image} alt="" width={48} height={60} className="object-cover bg-sand" />
                  <div className="text-xs"><b>{item.quantity} × {item.name}</b><p className="text-muted mt-1">{item.color} · {item.size}</p></div>
                </div>
              ))}
            </div>
          </details>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
          <Link href="/shop" className="btn btn-dark">
            {english ? 'Continue shopping' : 'Продолжить покупки'}
          </Link>
          <Link href="/" className="btn border border-ink">
            {english ? 'Back to home' : 'На главную'}
          </Link>
        </div>
      </section>
    </main>
  );
}
