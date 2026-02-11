import type { User } from "../models/User";

import { authStorage } from "./authStorage";

export type LoginResponse = {
  user: User;
  token: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const API_BASE: string =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_BASE ?? "/api";

async function jsonFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function makeToken(): string {
  // Good enough for demo/local auth
  return `demo_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const authService = {
  getCurrentUser(): User | null {
    return authStorage.getUser();
  },

  async fetchCurrentUser(): Promise<User | null> {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      const result = await jsonFetch<{ user: User }>(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      authStorage.setUser(result.user);
      return result.user;
    } catch {
      // If token is invalid/expired, clear local session.
      authStorage.clear();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(authStorage.getToken());
  },

  async login(username: string, password: string): Promise<LoginResponse> {
    if (!username.trim() || !password.trim()) {
      throw new Error("Udfyld både brugernavn og adgangskode.");
    }

    try {
      const result = await jsonFetch<LoginResponse>(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      authStorage.setToken(result.token);
      authStorage.setUser(result.user);
      return result;
    } catch (e) {
      // Friendly fallback for local dev if API isn't running yet.
      await sleep(150);
      const message = e instanceof Error ? e.message : "Login fejlede.";
      if (message.includes("Failed to fetch") || message.includes("Network")) {
        const user: User = {
          id: crypto?.randomUUID?.() ?? makeToken(),
          username: username.trim(),
          displayName: username.trim(),
        };
        const token = makeToken();
        authStorage.setToken(token);
        authStorage.setUser(user);
        return { user, token };
      }
      throw e;
    }
  },

  logout(): void {
    const token = authStorage.getToken();
    authStorage.clear();
    if (!token) return;

    void fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {
      // ignore
    });
  },
};
