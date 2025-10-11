"use client";
import { en_lang } from "@/features/translations/langs/en";
import { ru_lang } from "@/features/translations/langs/ru";
import { useLanguage } from "@/features/translations/lang_context";
import { useMemo } from "react";
import { TranslationKey } from "./translate_type";

const messages = { en: en_lang, ru: ru_lang };

export function useTranslation() {
  const { language } = useLanguage();

  const dict = useMemo(() => messages[language], [language]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValue(obj: any, path: string): string {
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? path;
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>) {
    const raw = getValue(dict, key);
    if (!vars) return raw;

    return raw.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  return { t, language };
}
