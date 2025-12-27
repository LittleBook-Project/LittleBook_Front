export const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || "/api";

export const apiUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  return `${API_BASE}${path}`;
};

export interface Page<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
