'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { products as fallbackProducts, categories as fallbackCategories } from './data/products';
import {
  listBanners,
  listCategories,
  listCollections,
  listProducts,
  listStoreSettings,
} from './services/product-repository';
import type { Banner, Category, Collection, Product } from '@/types';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  banners: Banner[];
  settings: Record<string, string>;
  loading: boolean;
  refresh: (force?: boolean) => Promise<void>;
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
type CatalogSnapshot = {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  banners: Banner[];
  settings: Record<string, string>;
  fetchedAt: number;
};
const CACHE_TTL = 2 * 60 * 1000;
let catalogRequest: Promise<Omit<CatalogSnapshot, 'fetchedAt'>> | null = null;
let inventoryRequest: Promise<Product[]> | null = null;
function fetchCatalog() {
  if (!catalogRequest) {
    catalogRequest = Promise.all([
      listProducts(),
      listCategories(),
      listCollections(),
      listBanners(),
      listStoreSettings(),
    ])
      .then(([products, categories, collections, banners, settings]) => ({
        products,
        categories,
        collections,
        banners,
        settings,
      }))
      .finally(() => {
        catalogRequest = null;
      });
  }
  return catalogRequest;
}
function fetchInventory() {
  if (!inventoryRequest) {
    inventoryRequest = listProducts().finally(() => {
      inventoryRequest = null;
    });
  }
  return inventoryRequest;
}
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const lastFetchedAt = useRef(0);
  const applySnapshot = useCallback((snapshot: Omit<CatalogSnapshot, 'fetchedAt'>) => {
    if (snapshot.products.length) setProducts(snapshot.products);
    if (snapshot.categories.length) setCategories(snapshot.categories);
    setCollections(snapshot.collections);
    setBanners(snapshot.banners);
    const mergedSettings = { ...defaultSettings, ...snapshot.settings };
    if (mergedSettings.telegram === 'SPHINX_STORE') mergedSettings.telegram = 'sphinx2003';
    setSettings(mergedSettings);
  }, []);
  const refreshInventory = useCallback(async (cached?: CatalogSnapshot | null) => {
    try {
      const latestProducts = await fetchInventory();
      if (latestProducts.length) setProducts(latestProducts);
      const previous =
        cached ?? clientStorage.get<CatalogSnapshot | null>(storageKeys.catalog, null);
      if (previous) {
        const fetchedAt = Date.now();
        lastFetchedAt.current = fetchedAt;
        clientStorage.set(storageKeys.catalog, {
          ...previous,
          products: latestProducts,
          fetchedAt,
        });
      }
    } catch (error) {
      console.info('[SPHINX_INVENTORY_REFRESH_FALLBACK]', error);
    }
  }, []);
  const refresh = useCallback(
    async (force = true) => {
      const cached = clientStorage.get<CatalogSnapshot | null>(storageKeys.catalog, null);
      if (!force && cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
        applySnapshot(cached);
        lastFetchedAt.current = cached.fetchedAt;
        setLoading(false);
        void refreshInventory(cached);
        return;
      }
      try {
        const snapshot = await fetchCatalog();
        applySnapshot(snapshot);
        const fetchedAt = Date.now();
        lastFetchedAt.current = fetchedAt;
        clientStorage.set(storageKeys.catalog, { ...snapshot, fetchedAt });
      } catch (error) {
        console.info('[SPHINX_SUPABASE_FALLBACK]', error);
      } finally {
        setLoading(false);
      }
    },
    [applySnapshot, refreshInventory],
  );
  useEffect(() => {
    const id = window.setTimeout(() => void refresh(false), 0);
    const refreshStock = () => {
      if (!document.hidden && Date.now() - lastFetchedAt.current > 30_000) void refreshInventory();
    };
    window.addEventListener('focus', refreshStock);
    document.addEventListener('visibilitychange', refreshStock);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('focus', refreshStock);
      document.removeEventListener('visibilitychange', refreshStock);
    };
  }, [refresh, refreshInventory]);
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
