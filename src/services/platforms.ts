export interface Platform {
  platform_id: number;
  name: string;
  url: string;
  logo: string;
  created_at: Date;
}

export async function getPlatforms() {
  const response = await fetch("/api/platforms");
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data as Platform[];
}

export async function createPlatform(platform: Partial<Platform>) {
  const response = await fetch("/api/platforms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(platform),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      Array.isArray(data.error) ? data.error[0].message : data.error
    );
  }

  return data.data as Platform;
}

export async function updatePlatform(
  platform_id: number,
  platform: Partial<Platform>
) {
  const response = await fetch(`/api/platforms/${platform_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(platform),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      Array.isArray(data.error) ? data.error[0].message : data.error
    );
  }

  return data.data as Platform;
}

export async function deletePlatform(platform_id: number) {
  const response = await fetch(`/api/platforms/${platform_id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return true;
}
