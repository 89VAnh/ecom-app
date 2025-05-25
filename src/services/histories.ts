export interface History {
  crawled_at: Date;
  platform_id: number;
  platform: string;
  title: string;
  price: number;
}

export async function getHistories(
  product_name: string = ""
): Promise<History[]> {
  const queryParams = new URLSearchParams({ product_name });
  const response = await fetch(`/api/histories?${queryParams}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data as History[];
}
