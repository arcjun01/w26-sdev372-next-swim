import { Resource } from "../types/resource";

const API_BASE = "http://localhost:3001/api";

export async function getResources(): Promise<Resource[]> {
  const response = await fetch(`${API_BASE}/resources`);

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return response.json();
}
