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
  phone: string;
  telegram?: string;
  city: string;
  comment?: string;
  items: number;
  lines: Array<{
    id: string;
    productName: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }>;
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
