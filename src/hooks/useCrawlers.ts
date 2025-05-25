import { useState, useEffect } from "react";
import {
  Crawler,
  getCrawlers,
  createCrawler,
  updateCrawler,
  deleteCrawler,
} from "@/services/crawlers";
import { toast } from "sonner";
import useDebounce from "./useDebounce";

export function useCrawlers() {
  const [crawlers, setCrawlers] = useState<Crawler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patternName, setPatternName] = useState<string>("");
  const debouncedSearch = useDebounce(patternName, 500);

  const fetchCrawlers = async () => {
    try {
      setLoading(true);
      const data = await getCrawlers(debouncedSearch);
      setCrawlers(data);
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

  const addCrawler = async (crawlerData: {
    name: string;
    platform_id: number;
    metadata: string;
    status: "active" | "error" | "paused";
  }) => {
    try {
      const newCrawler = await createCrawler(crawlerData);
      setCrawlers((prev) => [...prev, newCrawler]);
      toast.success("Thành công", {
        description: "Đã thêm crawler mới",
      });
      return newCrawler;
    } catch (err) {
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
      throw err;
    }
  };

  const editCrawler = async (
    crawler_id: string,
    crawlerData: Partial<Crawler>
  ) => {
    try {
      const updatedCrawler = await updateCrawler(crawler_id, crawlerData);
      console.log(crawler_id, updatedCrawler);
      setCrawlers((prev) =>
        prev.map((acc) =>
          acc.crawler_id === crawler_id ? updatedCrawler : acc
        )
      );
      toast.success("Thành công", {
        description: "Đã cập nhật thông tin crawler",
      });
      return updatedCrawler;
    } catch (err) {
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
      throw err;
    }
  };

  const removeCrawler = async (crawler_id: string) => {
    try {
      await deleteCrawler(crawler_id);
      setCrawlers((prev) =>
        prev.filter((acc) => acc.crawler_id !== crawler_id)
      );
      toast.success("Thành công", {
        description: "Đã xóa crawler",
      });
    } catch (err) {
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCrawlers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return {
    crawlers,
    loading,
    error,
    setPatternName,
    fetchCrawlers,
    addCrawler,
    editCrawler,
    removeCrawler,
  };
}
