import { createContext } from "react";

import type { Address } from "./models/Address";

export type AddressBookValue = {
  addresses: Address[];
  upsert: (input: Omit<Address, "updatedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const AddressBookContext = createContext<AddressBookValue | null>(null);
