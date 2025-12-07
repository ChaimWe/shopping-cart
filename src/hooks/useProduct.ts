import { useCallback, useEffect, useRef, useState } from "react";
import type { Product, useProductsExport } from "../types/interfaces";
import fakeProducts from "../utils/fakeProducts";

export default function useProducts(): useProductsExport {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(true);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);


  const loadProducts = async () => {
    try {
      const cachedProducts = localStorage.getItem("cache");
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      } else {
        const result = await fakeProducts(16);
        localStorage.setItem("cache", JSON.stringify(result));
        setProducts(result);
      }
    } catch (err) {
      console.log("error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingRef.current) return;
    setLoading(true);
    const result = await fakeProducts(16);

    setProducts((prev) => [...prev, ...result]);
    setLoading(false);
  };

  const handleScroll = useCallback(async () => {
    if (loadingRef.current) return;
    const distanceFromBottom =
      document.documentElement.scrollHeight -
      (window.scrollY + window.innerHeight);
    if (distanceFromBottom <= 500) await loadMore();
  }, []);
  
  useEffect(() => {
    loadProducts();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { products, loading };
}
