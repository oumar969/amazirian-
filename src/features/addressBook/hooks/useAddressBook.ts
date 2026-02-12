import { useContext } from "react";

import { AddressBookContext } from "../AddressBookContextBase";

export function useAddressBook() {
  const value = useContext(AddressBookContext);
  if (!value) throw new Error("useAddressBook must be used within AddressBookProvider");
  return value;
}
