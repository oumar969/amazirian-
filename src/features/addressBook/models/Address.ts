import type { Governorate } from "../../checkout/shipping";

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  governorate: Governorate;
  city: string;
  address: string;
  notes?: string;
  updatedAt: string; // ISO
};
