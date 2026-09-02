import type { Product } from './catalog';

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  databaseId?: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
}
