export interface Product {
  name: string;
  image: string;
  platform: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceChange: number;
  rating: number;
  reviews: number;
  purchase_count: number;
  link: string;
  crawled_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

export async function getProducts(
  search?: {
    name?: string;
    platform_id?: string;
    priceChangeOrder?: string;
    fromDate?: string;
    toDate?: string;
  },
  pageIndex: number = 0,
  pageSize: number = 10
): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  });
  if (search) {
    queryParams.append("search", JSON.stringify(search));
  }
  const response = await fetch(`/api/products?${queryParams}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch products");
  }

  return {
    products: data.products as Product[],
    total: data.total,
    pageIndex: data.pageIndex,
    pageSize: data.pageSize,
  };
}
