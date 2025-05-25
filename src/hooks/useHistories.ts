import { History, getHistories } from "@/services/histories";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useHistories() {
  const [histories, setHistories] = useState<History[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const data = await getHistories(productName);
      setHistories(data);
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
    if (productName) fetchHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName]);

  return {
    histories,
    loading,
    error,
    productName,
    setProductName,
    fetchHistories,
  };
}
