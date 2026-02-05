import type { Resource } from "../types/resource";

const API_BASE = "http://localhost:3001/api";

export async function getResources(): Promise<Resource[]> {
  const response = await fetch(`${API_BASE}/aquatic-resources`);

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return response.json();
}

export async function addResource(resource: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> {
  const response = await fetch(`${API_BASE}/aquatic-resources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resource),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add resource");
  }

  return response.json();
}
