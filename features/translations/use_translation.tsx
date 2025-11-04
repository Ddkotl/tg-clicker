"use client";
import { ReactNode, useMemo } from "react";
import { en_lang } from "@/features/translations/langs/en";
import { ru_lang } from "@/features/translations/langs/ru";
import { useLanguage } from "@/features/translations/lang_context";
import { TranslationKey } from "./translate_type";

const messages = { en: en_lang, ru: ru_lang };

export function useTranslation() {
  const { language } = useLanguage();
  const dict = useMemo(() => messages[language], [language]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValue(obj: any, path: string): string {
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? path;
  }

  // === t() как раньше — всегда возвращает STRING ===
  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    const raw = getValue(dict, key);
    if (!vars) return raw;

    return raw.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  // === tNode() — позволяет вставлять ReactNode ===
  function tNode(key: TranslationKey, vars?: Record<string, string | number | ReactNode>): ReactNode {
    const raw = getValue(dict, key);
    if (!vars) return raw;

    const parts = raw.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      const match = part.match(/^\{(.*)\}$/);
      if (match) {
        const name = match[1];
        return <span key={i}>{vars[name]}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return { t, tNode, language };
}
