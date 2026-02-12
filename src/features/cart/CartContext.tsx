import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import type { CartItem } from "./models/CartItem";
import { CartContext, type CartContextValue } from "./CartContextBase";

import { cartService } from "./services/cartService";

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
