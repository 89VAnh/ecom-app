export interface History {
  crawled_at: Date;
  platform_id: number;
  platform: string;
  title: string;
  price: number;
}

export async function getHistories(search?: {
  product_name?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<History[]> {
  const queryParams = new URLSearchParams({ search: JSON.stringify(search) });

  const response = await fetch(`/api/histories?${queryParams}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data as History[];
}
