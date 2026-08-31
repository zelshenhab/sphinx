export type ProductType = 'Streetwear' | 'Performance';

export interface ProductVariant {
  color: string;
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  colors: string[];
  sizes: string[];
  images: string[];
  featured: boolean;
  isNew?: boolean;
  isSale?: boolean;
  material: string;
  gsm?: string;
  fit: string;
  type: ProductType;
  description: string;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  active: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  productIds: string[];
}
