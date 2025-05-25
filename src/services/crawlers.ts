export interface Crawler {
  crawler_id: string;
  name: string;
  platform_id: number;
  platform: string;
  metadata: string;
  last_run: string;
  status: "active" | "error" | "paused" | "success";
}

export async function getCrawlers(namePattern?: string) {
  const searchParams = new URLSearchParams();
  if (namePattern) {
    searchParams.append("name", namePattern);
  }
  const url = `/api/crawlers?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data as Crawler[];
}

export async function createCrawler(crawler: {
  name: string;
  platform_id: number;
  metadata: string;
  status: "active" | "error" | "paused";
}) {
  const response = await fetch("/api/crawlers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(crawler),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      Array.isArray(data.error) ? data.error[0].message : data.error
    );
  }

  return data.data as Crawler;
}

export async function updateCrawler(
  crawler_id: string,
  crawler: Partial<Omit<Crawler, "crawler_id" | "created_at">>
) {
  const response = await fetch(`/api/crawlers/${crawler_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(crawler),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      Array.isArray(data.error) ? data.error[0].message : data.error
    );
  }

  return data.data as Crawler;
}

export async function deleteCrawler(crawler_id: string) {
  const response = await fetch(`/api/crawlers/${crawler_id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return true;
}
