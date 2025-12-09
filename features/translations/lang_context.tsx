"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLang } from "./translate_type";

interface LanguageContextType {
  language: SupportedLang;
  setLanguage: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLang>("en");
  const [loaded, setLoaded] = useState(false);

  // Загружаем язык только на клиенте
  useEffect(() => {
    const storedLang = localStorage.getItem("language") as SupportedLang | null;
    if (storedLang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(storedLang);
    }
    setLoaded(true);
  }, []);

  // Сохраняем при изменении
  useEffect(() => {
    if (loaded) localStorage.setItem("language", language);
  }, [language, loaded]);

  if (!loaded) {
    // Показываем безопасную заглушку, пока язык не загружен (избегаем рассинхронизации)
    return <div suppressHydrationWarning />;
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
