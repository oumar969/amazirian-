import type { Order } from "./models/Order";

const STORAGE_KEY = "amazirian.orders.v1";

function safeParseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `o_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.createdAt === "string" &&
    v.status === "placed" &&
    (v.currency === "DKK" || v.currency === "SYP") &&
    typeof v.subtotal === "number" &&
    typeof v.shippingSyp === "number" &&
    typeof v.total === "number" &&
    (v.paymentMethod === "cod" || v.paymentMethod === "bank" || v.paymentMethod === "card") &&
    typeof v.shipping === "object" &&
    Array.isArray(v.items)
  );
}

export function loadOrders(): Order[] {
  const parsed = safeParseJson(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(parsed) && parsed.every(isOrder)) return parsed;
  return [];
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function addOrder(input: Omit<Order, "id" | "createdAt" | "status"> & Partial<Pick<Order, "id" | "createdAt" | "status">>): Order[] {
  const current = loadOrders();
  const order: Order = {
    id: input.id?.trim() || uuid(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    status: input.status ?? "placed",
    currency: input.currency,
    subtotal: input.subtotal,
    shippingSyp: input.shippingSyp,
    total: input.total,
    paymentMethod: input.paymentMethod,
    shipping: input.shipping,
    items: input.items,
  };

  const next = [order, ...current];
  saveOrders(next);
  return next;
}

export function clearOrders(): Order[] {
  saveOrders([]);
  return [];
}

export function removeOrder(id: string): Order[] {
  const next = loadOrders().filter((o) => o.id !== id);
  saveOrders(next);
  return next;
}
