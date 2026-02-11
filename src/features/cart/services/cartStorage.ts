import type { CartItem } from "../models/CartItem";

const STORAGE_KEY = "amazirian.cart.v1";

function safeParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.productId !== "string") return false;
  if (typeof v.quantity !== "number") return false;
  if (!v.snapshot || typeof v.snapshot !== "object") return false;
  return true;
}

export const cartStorage = {
  load(): CartItem[] {
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(parsed) && parsed.every(isCartItem)) return parsed;
    return [];
  },

  save(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
