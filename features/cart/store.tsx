'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, X, Minus, Plus, Send, Trash2 } from 'lucide-react';
import type { CartItem, Product } from '@/types';
import { formatPrice, siteConfig, TELEGRAM_USERNAME } from '@/config/site';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
import { LanguageSwitch, useLanguage } from '@/features/i18n';
import { useNotification } from '@/features/notifications';
import { SearchDialog } from '@/features/search';
import { useCatalog } from '@/features/catalog';
type CartCtx = {
  items: CartItem[];
  add: (p: Product, c: string, s: string, q?: number) => void;
  remove: (i: number) => void;
  clear: () => void;
  change: (i: number, d: number) => void;
  updateVariant: (i: number, color: string, size: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  count: number;
  total: number;
};
const C = createContext<CartCtx | null>(null);
const stockForSize = (product: Product, size: string) =>
  product.sizeStock?.[size] ?? product.stockQuantity ?? 99;
const stockForVariant = (product: Product, color: string, size: string) =>
  product.variantStock?.[`${color}::${size}`] ?? stockForSize(product, size);
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
      const available = stockForVariant(product, color, size);
      const safeQuantity = Math.min(quantity, available);
      if (safeQuantity < 1) return x;
      if (i < 0) return [...x, { product, color, size, quantity: safeQuantity }];
      return x.map((v, n) =>
        n === i ? { ...v, quantity: Math.min(v.quantity + safeQuantity, available) } : v,
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
              quantity: Math.min(
                stockForVariant(v.product, v.color, v.size),
                Math.max(1, v.quantity + d),
              ),
            }
          : v,
      ),
    );
  const remove = (i: number) => {
    setItems((x) => x.filter((_, n) => n !== i));
    notify('cart_removed', 'info');
  };
  const updateVariant = (i: number, color: string, size: string) => {
    setItems((current) =>
      current.map((item, index) => {
        if (index !== i) return item;
        const available = stockForVariant(item.product, color, size);
        if (available < 1) return item;
        return { ...item, color, size, quantity: Math.min(item.quantity, available) };
      }),
    );
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
        updateVariant,
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
  const { language } = useLanguage();
  const visibleNav = [
    ...nav,
    ...categories
      .filter((category) => !nav.some(([, href]) => href === `/shop/${category.slug}`))
      .map((category) => [category.name, `/shop/${category.slug}`] as const),
  ];
  const telegram = settings.telegram || TELEGRAM_USERNAME;
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const currentCategory = categories.find((category) => pathname === `/shop/${category.slug}`);
  const pageLabel =
    currentCategory?.name ??
    (pathname.startsWith('/product/') ? (language === 'en' ? 'Product' : 'Товар') : '');
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menu]);
  return (
    <>
      <div className="bg-ink text-white text-center py-2 text-[10px] tracking-[.2em]">
        {settings.announcement || 'БЕСПЛАТНАЯ ДОСТАВКА ОТ 7 000 ₽'}
      </div>
      <header
        className={`sticky top-0 z-40 border-b border-black/10 transition ${scrolled ? 'bg-ivory shadow-lg backdrop-blur-xl' : 'bg-ivory/95 backdrop-blur'}`}
      >
        <div className="container-x h-16 sm:h-20 flex items-center justify-between relative">
          <button
            className="lg:hidden z-10 p-2 -ml-2"
            onClick={() => setMenu(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-center leading-none"
          >
            <b className="display text-xl sm:text-2xl tracking-[.22em]">
              {settings.brand || 'SPHINX'}
            </b>
            <small className="hidden sm:block text-[7px] tracking-[.42em] mt-1">
              {settings.tagline || 'THE GUARDIAN'}
            </small>
            {pageLabel && (
              <small className="block sm:hidden text-[7px] tracking-[.18em] mt-1 uppercase text-muted">
                {pageLabel}
              </small>
            )}
          </Link>
          <nav className="hidden lg:flex gap-6 text-[11px] uppercase tracking-wider">
            {visibleNav.map(([n, h]) => (
              <Link key={h} href={h} className="hover:text-brown">
                {n}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitch />
            </div>
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-1">
              <Search size={18} />
            </button>
            <a href={`https://t.me/${telegram}`}>
              <Send size={17} />
            </a>
            <button
              key={count}
              onClick={() => setOpen(true)}
              className={`relative ${count > 0 ? 'cart-bump' : ''}`}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <i className="absolute -top-2 -right-2 bg-gold text-white rounded-full not-italic text-[9px] w-4 h-4 grid place-items-center">
                  {count}
                </i>
              )}
            </button>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-[80] lg:hidden ${menu ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-black/45 transition-opacity ${menu ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute left-0 top-0 h-[100dvh] w-[86%] max-w-sm bg-ivory p-6 flex flex-col transition-transform duration-300 ${menu ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <b className="display text-2xl tracking-[.18em]">SPHINX</b>
            <button
              onClick={() => setMenu(false)}
              className="w-11 h-11 grid place-items-center"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>
          <nav className="grid py-7 divide-y divide-black/10 overflow-auto">
            {visibleNav.map(([n, h], index) => (
              <Link
                onClick={() => setMenu(false)}
                key={`${h}-${index}`}
                href={h}
                className={`py-4 display text-2xl ${pathname === h ? 'text-brown' : ''}`}
              >
                {n}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-black/10 pt-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] uppercase tracking-widest text-muted">Language</span>
              <LanguageSwitch />
            </div>
            <div className="flex justify-between text-xs">
              <Link href="/contact" onClick={() => setMenu(false)}>
                Контакты
              </Link>
              <a href={`https://instagram.com/sphinx.store`}>Instagram</a>
            </div>
          </div>
        </aside>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
export function Footer() {
  const { settings } = useCatalog();
  const telegram = settings.telegram || TELEGRAM_USERNAME;
  return (
    <footer className="bg-ink text-white mt-16 sm:mt-24">
      <div className="container-x py-12 sm:py-16 grid grid-cols-2 lg:grid-cols-4 gap-9 sm:gap-12">
        <div>
          <div className="display text-3xl tracking-[.2em]">{settings.brand || 'SPHINX'}</div>
          <div className="eyebrow mt-2 text-white/50">{settings.tagline || 'The Guardian'}</div>
          <p className="text-xs leading-6 text-white/55 mt-5 max-w-xs col-span-2">
            Современная одежда, вдохновлённая культурой и наследием Египта.
          </p>
        </div>
        <div className="text-sm grid gap-3">
          <b className="text-[10px] tracking-widest uppercase text-white/45">Навигация</b>
          <Link href="/about">О бренде</Link>
          <Link href="/contact">Контакты</Link>
          <Link href="/shop">Магазин</Link>
        </div>
        <div className="text-sm grid gap-3">
          <b className="text-[10px] tracking-widest uppercase text-white/45">Информация</b>
          <Link href="/privacy">Конфиденциальность</Link>
          <Link href="/returns">Возврат и обмен</Link>
          <Link href="/terms">Условия</Link>
          <Link href="/legal-contact">Данные продавца</Link>
        </div>
        <div className="text-sm grid gap-3 content-start">
          <b className="text-[10px] tracking-widest uppercase text-white/45">Мы на связи</b>
          <a href="https://instagram.com/sphinx.store" target="_blank" rel="noreferrer">
            Instagram · @sphinx.store
          </a>
          <a href={`https://t.me/${telegram}`} target="_blank" rel="noreferrer">
            Telegram · @{telegram}
          </a>
        </div>
      </div>
      <div className="container-x border-t border-white/10 py-5 flex flex-wrap justify-between gap-2 text-[10px] text-white/40">
        <span>© 2026 SPHINX</span>
        <span>THE GUARDIAN</span>
      </div>
    </footer>
  );
}
function CartDrawer() {
  const { items, open, setOpen, change, updateVariant, remove, total } = useCart();
  const { language } = useLanguage();
  const tr = (ru: string, en: string) => (language === 'en' ? en : ru);
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/35 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-[100dvh] w-full max-w-md bg-ivory p-4 sm:p-6 flex flex-col transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between border-b pb-5">
          <h2 className="display text-2xl">{tr('Корзина', 'Cart')}</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-auto py-5 space-y-5">
          {!items.length && (
            <p className="text-muted">{tr('Ваша корзина пуста.', 'Your cart is empty.')}</p>
          )}
          {items.map((x, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <Image
                src={getVariantImage(x.product, x.color)}
                alt=""
                width={80}
                height={100}
                className="bg-sand object-cover shrink-0"
              />
              <div className="flex-1 text-sm">
                <b>{x.product.name}</b>
                <div className="grid grid-cols-2 gap-2 my-3">
                  <label>
                    <span className="block text-[9px] uppercase tracking-wider text-muted mb-1">
                      {tr('Цвет', 'Color')}
                    </span>
                    <select
                      aria-label="Выбрать цвет"
                      className="w-full border border-black/15 bg-transparent px-2 py-1.5 text-xs"
                      value={x.color}
                      onChange={(event) => {
                        const nextColor = event.target.value;
                        const nextSize =
                          stockForVariant(x.product, nextColor, x.size) > 0
                            ? x.size
                            : (x.product.sizes.find(
                                (candidate) => stockForVariant(x.product, nextColor, candidate) > 0,
                              ) ?? x.size);
                        updateVariant(i, nextColor, nextSize);
                      }}
                    >
                      {x.product.colors.map((color) => (
                        <option
                          key={color}
                          value={color}
                          disabled={
                            !x.product.sizes.some(
                              (size) => stockForVariant(x.product, color, size) > 0,
                            )
                          }
                        >
                          {color}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="block text-[9px] uppercase tracking-wider text-muted mb-1">
                      {tr('Размер', 'Size')}
                    </span>
                    <select
                      aria-label="Выбрать размер"
                      className="w-full border border-black/15 bg-transparent px-2 py-1.5 text-xs"
                      value={x.size}
                      onChange={(event) => updateVariant(i, x.color, event.target.value)}
                    >
                      {x.product.sizes.map((size) => (
                        <option
                          key={size}
                          value={size}
                          disabled={stockForVariant(x.product, x.color, size) < 1}
                        >
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    className="w-8 h-8 grid place-items-center border"
                    onClick={() => change(i, -1)}
                  >
                    <Minus size={14} />
                  </button>
                  {x.quantity}
                  <button
                    className="w-8 h-8 grid place-items-center border"
                    onClick={() => change(i, 1)}
                  >
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
            <b>{tr('Итого', 'Total')}</b>
            <b>{formatPrice(total)}</b>
          </div>
          <Link onClick={() => setOpen(false)} href="/checkout" className="btn btn-dark w-full">
            {tr('Оформить заказ', 'Checkout')}
          </Link>
        </div>
      </aside>
    </div>
  );
}

export function getVariantImage(product: Product, color: string) {
  const galleryImage = product.colorImages?.[color]?.[0];
  if (galleryImage) return galleryImage;
  const normalizedColor = color.trim().toLowerCase();
  return (
    product.images.find((image) => image.toLowerCase().includes(normalizedColor)) ??
    product.images[0]
  );
}
