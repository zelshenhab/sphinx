export { ProductCard, ProductGrid, ProductGridSkeleton } from './components/product-card';
export { FeaturedProductGrid, CategoryProductGrid } from './components/catalog-grids';
export { categories, products } from './data/products';
export { CatalogProvider, useCatalog } from './catalog-provider';
export {
  createProduct,
  deleteProduct,
  listProducts,
  saveProductOrder,
  updateProduct,
  uploadProductImage,
} from './services/product-repository';
