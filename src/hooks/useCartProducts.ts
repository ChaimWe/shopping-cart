import useProducts from "./useProduct";
import { CartStore } from "../lib/CartStore";
import type { CartProduct } from "../types/interfaces";

export default function useCartProducts() {
  const inCart = CartStore.addedItems;
  const { products } = useProducts();

  const cartProducts: CartProduct[] = inCart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      return { ...product, amount: item.amount };
    })
    .filter((item): item is CartProduct => item !== null);

  const total = cartProducts.reduce(
    (sum, product) => sum + product.amount * product.price,
    0
  );
  return [cartProducts, total] as const;
}
