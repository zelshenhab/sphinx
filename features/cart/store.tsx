'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, ShoppingBag, X, Minus, Plus, Send, Trash2 } from 'lucide-react';
import type { CartItem, Product } from '@/types';
import { formatPrice, siteConfig, TELEGRAM_USERNAME } from '@/config/site';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
import { LanguageSwitch } from '@/features/i18n';
import { useNotification } from '@/features/notifications';
import { SearchDialog } from '@/features/search';
import { useCatalog } from '@/features/catalog';
type CartCtx = {
  items: CartItem[];
  add: (p: Product, c: string, s: string, q?: number) => void;
  remove: (i: number) => void;
  clear: () => void;
  change: (i: number, d: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  count: number;
  total: number;
};
const C = createContext<CartCtx | null>(null);
const stockForSize = (product: Product, size: string) =>
  product.sizeStock?.[size] ?? product.stockQuantity ?? 99;
export const useCart = () => {
  const c = useContext(C);
  if (!c) throw Error('Cart');
  return c;
};
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { notify } = useNotification();
  useEffect(() => {
    const id = window.setTimeout(() => {
      setItems(clientStorage.get(storageKeys.cart, []));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (hydrated) clientStorage.set(storageKeys.cart, items);
  }, [items, hydrated]);
  const add = (product: Product, color: string, size: string, quantity = 1) => {
    setItems((x) => {
      const i = x.findIndex(
        (v) => v.product.id === product.id && v.color === color && v.size === size,
      );
      const available = stockForSize(product, size);
      const safeQuantity = Math.min(quantity, available);
      if (safeQuantity < 1) return x;
      if (i < 0) return [...x, { product, color, size, quantity: safeQuantity }];
      return x.map((v, n) =>
        n === i
          ? { ...v, quantity: Math.min(v.quantity + safeQuantity, available) }
          : v,
      );
    });
    setOpen(true);
    notify('cart_added', 'success');
  };
  const change = (i: number, d: number) =>
    setItems((x) =>
      x.map((v, n) =>
        n === i
          ? {
              ...v,
              quantity: Math.min(stockForSize(v.product, v.size), Math.max(1, v.quantity + d)),
            }
          : v,
      ),
    );
  const remove = (i: number) => {
    setItems((x) => x.filter((_, n) => n !== i));
    notify('cart_removed', 'info');
  };
  const clear = () => setItems([]);
  return (
    <C.Provider
      value={{
        items,
        add,
        remove,
        clear,
        change,
        open,
        setOpen,
        count: items.reduce((a, b) => a + b.quantity, 0),
        total: items.reduce((a, b) => a + b.product.price * b.quantity, 0),
      }}
    >
      {children}
      <CartDrawer />
    </C.Provider>
  );
}
const nav = siteConfig.navigation.map(({ label, href }) => [label, href] as const);
export function Header() {
  const { count, setOpen } = useCart();
  const { categories, settings } = useCatalog();
  const visibleNav = [
    ...nav,
    ...categories
      .filter((category) => !nav.some(([, href]) => href === `/shop/${category.slug}`))
      .map((category) => [category.name, `/shop/${category.slug}`] as const),
  ];
  const telegram = settings.telegram || TELEGRAM_USERNAME;
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <>
      <div className="bg-ink text-white text-center py-2 text-[10px] tracking-[.2em]">
        {settings.announcement || 'БЕСПЛАТНАЯ ДОСТАВКА ОТ 7 000 ₽'}
      </div>
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-black/10">
        <div className="container-x h-20 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setMenu(!menu)}>
            <Menu />
          </button>
          <Link href="/" className="text-center leading-none">
            <b className="display text-2xl tracking-[.22em]">{settings.brand || 'SPHINX'}</b>
            <small className="block text-[7px] tracking-[.42em] mt-1">
              {settings.tagline || 'THE GUARDIAN'}
            </small>
          </Link>
          <nav className="hidden lg:flex gap-6 text-[11px] uppercase tracking-wider">
            {visibleNav.map(([n, h]) => (
              <Link key={h} href={h} className="hover:text-brown">
                {n}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitch />
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-1">
              <Search size={18} />
            </button>
            <a href={`https://t.me/${telegram}`}>
              <Send size={17} />
            </a>
            <button onClick={() => setOpen(true)} className="relative">
              <ShoppingBag size={20} />
              {count > 0 && (
                <i className="absolute -top-2 -right-2 bg-gold text-white rounded-full not-italic text-[9px] w-4 h-4 grid place-items-center">
                  {count}
                </i>
              )}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="lg:hidden px-6 pb-6 grid gap-4">
            {visibleNav.map(([n, h]) => (
              <Link onClick={() => setMenu(false)} key={h} href={h}>
                {n}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
export function Footer() {
  const { settings } = useCatalog();
  return (
    <footer className="bg-ink text-white mt-24">
      <div className="container-x py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="display text-3xl tracking-[.2em]">{settings.brand || 'SPHINX'}</div>
          <div className="eyebrow mt-2 text-white/50">{settings.tagline || 'The Guardian'}</div>
        </div>
        <p className="text-sm text-white/60 max-w-sm">
          Современная одежда, вдохновлённая культурой и наследием Египта.
        </p>
        <div className="md:text-right text-sm space-x-5">
          <Link href="/about">О бренде</Link>
          <Link href="/contact">Контакты</Link>
        </div>
      </div>
    </footer>
  );
}
function CartDrawer() {
  const { items, open, setOpen, change, remove, total } = useCart();
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/35 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-ivory p-6 flex flex-col transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between border-b pb-5">
          <h2 className="display text-2xl">Корзина</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-auto py-5 space-y-5">
          {!items.length && <p className="text-muted">Ваша корзина пуста.</p>}
          {items.map((x, i) => (
            <div key={i} className="flex gap-4">
              <Image
                src={x.product.images[0]}
                alt=""
                width={90}
                height={110}
                className="bg-sand object-cover"
              />
              <div className="flex-1 text-sm">
                <b>{x.product.name}</b>
                <p className="text-muted my-2">
                  {x.color} · {x.size}
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => change(i, -1)}>
                    <Minus size={14} />
                  </button>
                  {x.quantity}
                  <button onClick={() => change(i, 1)}>
                    <Plus size={14} />
                  </button>
                  <button className="ml-auto" onClick={() => remove(i)}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <b className="block mt-2">{formatPrice(x.product.price * x.quantity)}</b>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-5">
          <div className="flex justify-between text-lg mb-5">
            <b>Итого</b>
            <b>{formatPrice(total)}</b>
          </div>
          <Link onClick={() => setOpen(false)} href="/checkout" className="btn btn-dark w-full">
            Оформить заказ
          </Link>
        </div>
      </aside>
    </div>
  );
}
