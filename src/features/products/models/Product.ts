export type ProductCategory =
  | "Elektronik"
  | "Tøj"
  | "Bøger"
  | "Hjem"
  | "Skønhed"
  | "Legetøj"
  | "Sport"
  | "Andet";

export type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  currency: "DKK" | "SYP";
  imageUrl: string;
  category: ProductCategory;
  rating: number; // 0..5
  ratingCount: number;
  prime: boolean;
  createdAt: string; // ISO
};
