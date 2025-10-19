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

  useEffect(() => {
    const stored_lang = localStorage.getItem("language");
    if (stored_lang) {
      setLanguage(stored_lang as SupportedLang);
    }
  }, []);
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
