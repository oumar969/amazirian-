import type { ReactNode } from "react";
import { createContext, useEffect, useMemo, useState } from "react";

import type { Product } from "../products/models/Product";
import type { CartItem } from "./models/CartItem";

import { cartService } from "./services/cartService";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartService.list());
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = cartService.count(items);
    const subtotal = cartService.subtotal(items);

    return {
      items,
      itemCount,
      subtotal,
      addToCart(product, quantity) {
        setItems(cartService.add(product, quantity ?? 1));
      },
      setQuantity(productId, quantity) {
        setItems(cartService.setQuantity(productId, quantity));
      },
      removeFromCart(productId) {
        setItems(cartService.remove(productId));
      },
      clearCart() {
        setItems(cartService.clear());
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
