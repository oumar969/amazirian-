import { createContext } from "react";

import type { Order } from "./models/Order";

export type OrdersValue = {
  orders: Order[];
  add: (order: Omit<Order, "id" | "createdAt" | "status">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const OrdersContext = createContext<OrdersValue | null>(null);
