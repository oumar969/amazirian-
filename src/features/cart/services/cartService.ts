import type { Product } from "../../products/models/Product";
import type { CartItem } from "../models/CartItem";

import { cartStorage } from "./cartStorage";

function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(99, Math.floor(value)));
}

export const cartService = {
  list(): CartItem[] {
    return cartStorage.load();
  },

  add(product: Product, quantity = 1): CartItem[] {
    const qty = clampQuantity(quantity);
    const items = cartStorage.load();
    const existing = items.find((i) => i.productId === product.id);

    const next: CartItem[] = existing
      ? items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: clampQuantity(i.quantity + qty) }
            : i,
        )
      : [
          {
            productId: product.id,
            quantity: qty,
            snapshot: {
              title: product.title,
              price: product.price,
              currency: product.currency,
              imageUrl: product.imageUrl,
              category: product.category,
              prime: product.prime,
              rating: product.rating,
              ratingCount: product.ratingCount,
            },
          },
          ...items,
        ];

    cartStorage.save(next);
    return next;
  },

  setQuantity(productId: string, quantity: number): CartItem[] {
    const qty = clampQuantity(quantity);
    const items = cartStorage.load();
    const next = items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
    cartStorage.save(next);
    return next;
  },

  remove(productId: string): CartItem[] {
    const items = cartStorage.load();
    const next = items.filter((i) => i.productId !== productId);
    cartStorage.save(next);
    return next;
  },

  clear(): CartItem[] {
    cartStorage.clear();
    return [];
  },

  count(items: CartItem[]): number {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  },

  subtotal(items: CartItem[]): number {
    return items.reduce((sum, i) => sum + i.quantity * i.snapshot.price, 0);
  },
};
