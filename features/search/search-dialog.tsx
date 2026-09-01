'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { products as catalogProducts } from '@/features/catalog/data/products';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
import { formatPrice } from '@/config/site';
import { useLanguage } from '@/features/i18n';
import type { Product } from '@/types';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);
  const products = useMemo(() => {
    void open;
    return clientStorage.get<Product[]>(storageKeys.products, catalogProducts);
  }, [open]);

  const copy =
    language === 'ru'
      ? {
          title: 'Поиск',
          placeholder: 'Название, категория или коллекция...',
          empty: 'Ничего не найдено. Попробуйте другой запрос.',
          hint: 'Начните вводить название товара',
          results: 'Результаты',
          close: 'Закрыть поиск',
        }
      : {
          title: 'Search',
          placeholder: 'Name, category or collection...',
          empty: 'Nothing found. Try another search.',
          hint: 'Start typing a product name',
          results: 'Results',
          close: 'Close search',
        };

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];
    return products
      .filter((product) =>
        [product.name, product.category, product.description, product.type]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalized),
      )
      .slice(0, 8);
  }, [products, query]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <div
      className={`fixed inset-0 z-[90] transition ${open ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        className="absolute inset-0 h-full w-full bg-ink/35 backdrop-blur-sm"
        aria-label={copy.close}
        onClick={close}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className={`absolute inset-x-0 top-0 max-h-[88vh] overflow-auto bg-ivory shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container-x py-6 md:py-9">
          <div className="flex items-center justify-between gap-5">
            <p className="eyebrow text-brown">{copy.title}</p>
            <button onClick={close} aria-label={copy.close} className="p-2 hover:rotate-90">
              <X size={22} />
            </button>
          </div>
          <div className="mt-5 flex items-center gap-4 border-b border-ink/25 pb-4 focus-within:border-brown">
            <Search size={24} className="shrink-0 text-brown" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.placeholder}
              className="w-full bg-transparent text-xl md:text-3xl display outline-none placeholder:text-muted/60"
            />
          </div>

          {!query.trim() && <p className="py-10 text-center text-sm text-muted">{copy.hint}</p>}
          {query.trim() && results.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">{copy.empty}</p>
          )}
          {results.length > 0 && (
            <div className="pt-7">
              <p className="eyebrow text-muted mb-5">
                {copy.results} · {results.length}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map((product) => (
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={close}
                    key={product.id}
                    className="group flex gap-4 border border-black/10 bg-white p-3 hover:border-gold"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 py-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        {product.category}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-sm">{product.name}</h3>
                      <b className="mt-3 block text-sm">{formatPrice(product.price)}</b>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
