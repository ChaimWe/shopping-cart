import { useMemo } from "react";
import type { Product } from "../types/interfaces";

export default function useFilteredProducts(
  products: Product[],
  searchTerm: string | null,
  categoryTerm: string | null
): Product[] {
  const normalizedSearch = searchTerm?.toLowerCase() || "";
  const normalizedCategory = categoryTerm?.toLowerCase() || "";

  const filtered = useMemo(() => {
    return products.filter((product) => {
        
      const matchedSearch =
        !normalizedSearch ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      const matchedCategory =
        !normalizedCategory ||
        product.category.toLowerCase().includes(normalizedCategory);
      return matchedCategory && matchedSearch;
    });
  }, [products, normalizedCategory, normalizedSearch]);
  return filtered;
}
