import type { Product } from "../../products/models/Product";

export type FavoriteItem = {
  productId: string;
  snapshot: Product;
  addedAt: string; // ISO
};
