export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
};
export interface ProductCardProps {
  product: Product & { amount?: number };
}
export type AddedItems = {
  id: number;
  amount: number;
};
export interface useProductsExport {
  products: Product[];
  loading: boolean;
}
export type CartProduct = Product & { amount: number };
export interface useFilteredProductsExport {
  
}
