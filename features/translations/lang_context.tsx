"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLang } from "./translate_type";

interface LanguageContextType {
  language: SupportedLang;
  setLanguage: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Инициализация состояния через lazy initializer
  const [language, setLanguage] = useState<SupportedLang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as SupportedLang | null) ?? "en";
    }
    return "en"; // серверный рендер
  });

  // Синхронизация в localStorage — это ВНЕШНЯЯ система → идеально подходит для effect
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
