import { useContext } from "react";

import { OrdersContext } from "../OrdersContextBase";

export function useOrders() {
  const value = useContext(OrdersContext);
  if (!value) throw new Error("useOrders must be used within OrdersProvider");
  return value;
}
