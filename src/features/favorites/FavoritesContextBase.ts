import { createContext } from "react";

import type { Product } from "../products/models/Product";
import type { FavoriteItem } from "./models/FavoriteItem";

export type FavoritesContextValue = {
  items: FavoriteItem[];
  count: number;
  isFavorite: (productId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
