'use client';
import {ProductGrid} from './product-card';import {useCatalog} from '../catalog-provider';
export function FeaturedProductGrid({limit=8}:{limit?:number}){const{products}=useCatalog();return <ProductGrid products={products.filter(product=>product.featured).slice(0,limit)}/>}
export function CategoryProductGrid({category}:{category:string}){const{products}=useCatalog();return <ProductGrid products={products.filter(product=>product.category===category)}/>}
