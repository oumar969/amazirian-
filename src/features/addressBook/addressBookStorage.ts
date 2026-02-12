import type { Address } from "./models/Address";

const STORAGE_KEY = "amazirian.addresses.v1";

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
  return `a_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isAddress(value: unknown): value is Address {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.label === "string" &&
    typeof v.fullName === "string" &&
    typeof v.phone === "string" &&
    typeof v.governorate === "string" &&
    typeof v.city === "string" &&
    typeof v.address === "string" &&
    (v.notes === undefined || typeof v.notes === "string") &&
    typeof v.updatedAt === "string"
  );
}

export function loadAddresses(): Address[] {
  const parsed = safeParseJson(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(parsed) && parsed.every(isAddress)) return parsed;
  return [];
}

export function saveAddresses(addresses: Address[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function upsertAddress(input: Omit<Address, "id" | "updatedAt"> & Partial<Pick<Address, "id">>): Address[] {
  const current = loadAddresses();
  const id = input.id?.trim() || uuid();
  const nextItem: Address = {
    id,
    label: input.label.trim() || "Address",
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    governorate: input.governorate,
    city: input.city.trim(),
    address: input.address.trim(),
    notes: input.notes?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  const idx = current.findIndex((a) => a.id === id);
  const next = idx >= 0 ? current.map((a) => (a.id === id ? nextItem : a)) : [nextItem, ...current];
  saveAddresses(next);
  return next;
}

export function removeAddress(id: string): Address[] {
  const next = loadAddresses().filter((a) => a.id !== id);
  saveAddresses(next);
  return next;
}

export function clearAddresses(): Address[] {
  saveAddresses([]);
  return [];
}
