export const storageKeys = {
  cart: 'sphinx-cart',
  language: 'sphinx-language',
  products: 'sphinx-products',
  settings: 'sphinx-settings',
  catalog: 'sphinx-catalog-cache-v1',
} as const;

export const clientStorage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      const legacyValue = window.localStorage.getItem(key);
      return (legacyValue as T) ?? fallback;
    }
  },
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('sphinx:storage-error', { detail: error }));
    }
  },
};
