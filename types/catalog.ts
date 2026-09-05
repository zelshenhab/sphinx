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
  colorImages?: Record<string, string[]>;
  sizeStock?: Record<string, number>;
  variantStock?: Record<string, number>;
  stockQuantity?: number;
  featured: boolean;
  isNew?: boolean;
  isSale?: boolean;
  material: string;
  gsm?: string;
  fit: string;
  type: ProductType;
  description: string;
  variants?: ProductVariant[];
  lowStockThreshold?: number;
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
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
  status?: 'available' | 'coming-soon';
  sortOrder?: number;
  productIds: string[];
  active?: boolean;
}
