import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import type { Order } from "./models/Order";
import { OrdersContext, type OrdersValue } from "./OrdersContextBase";
import { addOrder, clearOrders, loadOrders, removeOrder } from "./ordersStorage";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const value = useMemo<OrdersValue>(() => {
    return {
      orders,
      add(order) {
        setOrders(addOrder(order));
      },
      remove(id) {
        setOrders(removeOrder(id));
      },
      clear() {
        setOrders(clearOrders());
      },
    };
  }, [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
