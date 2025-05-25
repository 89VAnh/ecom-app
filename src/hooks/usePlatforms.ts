import { useState, useEffect } from "react";
import {
  Platform,
  getPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
} from "@/services/platforms";
import { toast } from "sonner";

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const data = await getPlatforms();
      setPlatforms(data);
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

  const addPlatform = async (platform: Partial<Platform>) => {
    try {
      const newPlatform = await createPlatform(platform);
      setPlatforms((prev) => [...prev, newPlatform]);
      toast.success("Thành công", {
        description: "Đã thêm sàn thương mại mới",
      });
      return newPlatform;
    } catch (err) {
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
      throw err;
    }
  };

  const editPlatform = async (id: number, platform: Partial<Platform>) => {
    try {
      const updatedPlatform = await updatePlatform(id, platform);
      setPlatforms((prev) =>
        prev.map((p) => (p.platform_id === id ? updatedPlatform : p))
      );
      toast.success("Thành công", {
        description: "Đã cập nhật thông tin sàn thương mại",
      });
      return updatedPlatform;
    } catch (err) {
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
      throw err;
    }
  };

  const removePlatform = async (id: number) => {
    try {
      await deletePlatform(id);
      setPlatforms((prev) => prev.filter((p) => p.platform_id !== id));
      toast.success("Thành công", {
        description: "Đã xóa sàn thương mại",
      });
    } catch (err) {
      toast.error("Lỗi", {
        description: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  return {
    platforms,
    loading,
    error,
    fetchPlatforms,
    addPlatform,
    editPlatform,
    removePlatform,
  };
}
