'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { products as fallbackProducts, categories as fallbackCategories } from './data/products';
import { listCategories, listProducts } from './services/product-repository';
import type { Category, Product } from '@/types';

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
}
const CatalogContext = createContext<CatalogContextValue | null>(null);
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try {
      const [remoteProducts, remoteCategories] = await Promise.all([
        listProducts(),
        listCategories(),
      ]);
      if (remoteProducts.length) setProducts(remoteProducts);
      if (remoteCategories.length) setCategories(remoteCategories);
    } catch (error) {
      console.info('[SPHINX_SUPABASE_FALLBACK]', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const id = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <CatalogContext.Provider value={{ products, categories, loading, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}
export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}
