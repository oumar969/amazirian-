import { useContext } from "react";

import { I18nContext } from "../I18nContextBase";

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  const { t, language, dir, setLanguage } = ctx;
  return { t, language, dir, setLanguage };
}
