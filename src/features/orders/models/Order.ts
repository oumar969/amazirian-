import type { Product } from "../../products/models/Product";
import type { CartItem } from "../../cart/models/CartItem";
import type { Governorate } from "../../checkout/shipping";

export type OrderPaymentMethod = "cod" | "bank" | "card";

export type OrderItem = {
  productId: string;
  quantity: number;
  snapshot: CartItem["snapshot"];
};

export type OrderShipping = {
  fullName: string;
  phone: string;
  governorate: Governorate;
  city: string;
  address: string;
  notes?: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  status: "placed";
  currency: Product["currency"]; // order currency (based on cart)
  subtotal: number;
  shippingSyp: number;
  total: number;
  paymentMethod: OrderPaymentMethod;
  shipping: OrderShipping;
  items: OrderItem[];
};
