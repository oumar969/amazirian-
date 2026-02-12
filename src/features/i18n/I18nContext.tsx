import { useEffect, useMemo, useState } from "react";

import {
  detectDefaultLanguage,
  I18N_STORAGE_KEY,
  languageDir,
  LANGUAGES,
  type Language,
  translate,
  type TranslateVars,
} from "./i18n";
import { I18nContext, type I18nContextValue } from "./I18nContextBase";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(I18N_STORAGE_KEY) as Language | null;
    if (stored && (LANGUAGES as readonly string[]).includes(stored)) return stored;
    return detectDefaultLanguage();
  });

  const dir = useMemo(() => languageDir(language), [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(I18N_STORAGE_KEY, lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      dir,
      setLanguage,
      t: (key: string, vars?: TranslateVars) => translate(language, key, vars),
    };
  }, [dir, language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
