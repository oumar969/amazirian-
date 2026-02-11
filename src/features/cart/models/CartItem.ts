import type { Product } from "../../products/models/Product";

export type CartItem = {
  productId: string;
  quantity: number;
  snapshot: Pick<
    Product,
    | "title"
    | "price"
    | "currency"
    | "imageUrl"
    | "category"
    | "prime"
    | "rating"
    | "ratingCount"
  >;
};
