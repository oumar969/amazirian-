import { createContext } from "react";

import type { Product } from "../products/models/Product";
import type { CartItem } from "./models/CartItem";

export type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (
    product: Pick<
      Product,
      | "id"
      | "title"
      | "price"
      | "currency"
      | "imageUrl"
      | "category"
      | "prime"
      | "rating"
      | "ratingCount"
    >,
    quantity?: number,
  ) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
