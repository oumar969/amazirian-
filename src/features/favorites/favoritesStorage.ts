import type { Product } from "../products/models/Product";
import type { FavoriteItem } from "./models/FavoriteItem";

const STORAGE_KEY = "amazirian.favorites";

function safeParse(json: string | null): unknown {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadFavorites(): FavoriteItem[] {
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
  if (!Array.isArray(parsed)) return [];
  const items: FavoriteItem[] = [];
  for (const raw of parsed) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.productId !== "string") continue;
    if (!r.snapshot || typeof r.snapshot !== "object") continue;
    const addedAt = typeof r.addedAt === "string" ? r.addedAt : new Date().toISOString();
    items.push({ productId: r.productId, snapshot: r.snapshot as Product, addedAt });
  }
  return items;
}

export function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isFavorite(items: FavoriteItem[], productId: string): boolean {
  return items.some((i) => i.productId === productId);
}

export function toggleFavorite(items: FavoriteItem[], product: Product): FavoriteItem[] {
  const exists = items.some((i) => i.productId === product.id);
  if (exists) return items.filter((i) => i.productId !== product.id);
  const next: FavoriteItem = { productId: product.id, snapshot: product, addedAt: new Date().toISOString() };
  return [next, ...items];
}

export function removeFavorite(items: FavoriteItem[], productId: string): FavoriteItem[] {
  return items.filter((i) => i.productId !== productId);
}

export function clearFavorites(): FavoriteItem[] {
  return [];
}
