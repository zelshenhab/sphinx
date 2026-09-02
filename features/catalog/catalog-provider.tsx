'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { products as fallbackProducts, categories as fallbackCategories } from './data/products';
import {
  listBanners,
  listCategories,
  listCollections,
  listProducts,
  listStoreSettings,
} from './services/product-repository';
import type { Banner, Category, Collection, Product } from '@/types';

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  banners: Banner[];
  settings: Record<string, string>;
  loading: boolean;
  refresh: () => Promise<void>;
}
const CatalogContext = createContext<CatalogContextValue | null>(null);
const defaultSettings: Record<string, string> = {
  brand: 'SPHINX',
  tagline: 'THE GUARDIAN',
  telegram: 'sphinx2003',
  announcement: 'БЕСПЛАТНАЯ ДОСТАВКА ОТ 7 000 ₽',
  sizes: 'XS, S, M, L, XL, XXL, 3XL',
  colors: 'Black, White, Sand, Olive, Navy, Brown',
};
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const [remoteProducts, remoteCategories, remoteCollections, remoteBanners, remoteSettings] =
        await Promise.all([
          listProducts(),
          listCategories(),
          listCollections(),
          listBanners(),
          listStoreSettings(),
        ]);
      if (remoteProducts.length) setProducts(remoteProducts);
      if (remoteCategories.length) setCategories(remoteCategories);
      setCollections(remoteCollections);
      setBanners(remoteBanners);
      const mergedSettings = { ...defaultSettings, ...remoteSettings };
      if (mergedSettings.telegram === 'SPHINX_STORE') mergedSettings.telegram = 'sphinx2003';
      setSettings(mergedSettings);
    } catch (error) {
      console.info('[SPHINX_SUPABASE_FALLBACK]', error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const id = window.setTimeout(() => void refresh(), 0);
    const handleFocus = () => void refresh();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refresh]);
  return (
    <CatalogContext.Provider
      value={{ products, categories, collections, banners, settings, loading, refresh }}
    >
      {children}
    </CatalogContext.Provider>
  );
}
export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}
