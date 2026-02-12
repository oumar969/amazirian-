import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import type { Address } from "./models/Address";
import { type AddressBookValue, AddressBookContext } from "./AddressBookContextBase";
import { clearAddresses, loadAddresses, removeAddress, upsertAddress } from "./addressBookStorage";

export function AddressBookProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    setAddresses(loadAddresses());
  }, []);

  const value = useMemo<AddressBookValue>(() => {
    return {
      addresses,
      upsert(input) {
        setAddresses(
          upsertAddress({
            id: input.id,
            label: input.label,
            fullName: input.fullName,
            phone: input.phone,
            governorate: input.governorate,
            city: input.city,
            address: input.address,
            notes: input.notes,
          }),
        );
      },
      remove(id) {
        setAddresses(removeAddress(id));
      },
      clear() {
        setAddresses(clearAddresses());
      },
    };
  }, [addresses]);

  return <AddressBookContext.Provider value={value}>{children}</AddressBookContext.Provider>;
}
