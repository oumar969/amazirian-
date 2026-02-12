import { useEffect, useMemo, useState } from "react";

import type { Product } from "../products/models/Product";
import type { FavoriteItem } from "./models/FavoriteItem";
import { FavoritesContext, type FavoritesContextValue } from "./FavoritesContextBase";
import {
  clearFavorites,
  isFavorite,
  loadFavorites,
  removeFavorite,
  saveFavorites,
  toggleFavorite,
} from "./favoritesStorage";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>(() => loadFavorites());

  useEffect(() => {
    saveFavorites(items);
  }, [items]);

  const value = useMemo<FavoritesContextValue>(() => {
    return {
      items,
      count: items.length,
      isFavorite: (productId: string) => isFavorite(items, productId),
      toggle: (product: Product) => setItems((prev) => toggleFavorite(prev, product)),
      remove: (productId: string) => setItems((prev) => removeFavorite(prev, productId)),
      clear: () => setItems(clearFavorites()),
    };
  }, [items]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
