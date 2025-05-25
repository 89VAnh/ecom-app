import { getProducts, Product } from "@/services/products";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useDebounce from "./useDebounce";

interface UseProductsProps {
  initialPageIndex?: number;
  initialPageSize?: number;
  priceChangeOrder?: string;
}

export function useProducts({
  initialPageIndex = 0,
  initialPageSize = 12,
  priceChangeOrder = "",
}: UseProductsProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(initialPageIndex || 0);
  const [pageSize, setPageSize] = useState<number>(initialPageSize || 12);
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    platform_id?: string;
    priceChangeOrder?: string;
    fromDate?: string;
    toDate?: string;
  }>({ priceChangeOrder: priceChangeOrder });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchParams, 500);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (debouncedSearch.platform_id) {
        if (debouncedSearch.platform_id === "all") {
          delete debouncedSearch.platform_id;
        } else {
          debouncedSearch.platform_id = parseInt(debouncedSearch.platform_id);
        }
      }

      const { products, total } = await getProducts(
        debouncedSearch,
        pageIndex,
        pageSize
      );
      setProducts(products);
      setTotal(total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, debouncedSearch]);

  return {
    products,
    total,
    pageIndex,
    pageSize,
    searchParams,
    loading,
    error,
    setPageIndex,
    setPageSize,
    setSearchParams,
    fetchProducts,
  };
}
