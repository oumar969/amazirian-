import { createContext } from "react";

import type { Language, TranslateVars } from "./i18n";

export type I18nContextValue = {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: TranslateVars) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);
