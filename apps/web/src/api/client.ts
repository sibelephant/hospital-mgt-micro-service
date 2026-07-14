import type { AuthSession } from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function apiUrl(path: string) {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${baseUrl}${normalizedPath.slice(4)}`;
  }
  return `${baseUrl}${normalizedPath}`;
}

export function readStoredSession(): AuthSession | null {
  const stored = window.localStorage.getItem("caregrid-auth");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthSession;
  } catch {
    window.localStorage.removeItem("caregrid-auth");
    return null;
  }
}

export async function refreshSession(refreshToken: string) {
  try {
    const response = await fetch(apiUrl("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    if (!response.ok) throw new Error("Refresh failed");
    const session = (await response.json()) as AuthSession;
    window.localStorage.setItem("caregrid-auth", JSON.stringify(session));
    return session;
  } catch {
    window.localStorage.removeItem("caregrid-auth");
    return null;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const session = readStoredSession();
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401 && session?.refreshToken && path !== "/auth/refresh" && path !== "/auth/login") {
      const refreshed = await refreshSession(session.refreshToken);
      if (refreshed) {
        return apiRequest<T>(path, init);
      }
    }
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}
