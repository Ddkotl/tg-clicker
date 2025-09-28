"use client";
import { useLanguage } from "@/contexts/lang_context";
import { en_lang } from "@/transtate/en";
import { ru_lang } from "@/transtate/ru";
import { TranslationKey } from "@/types/translate_type";
import { useMemo } from "react";

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
