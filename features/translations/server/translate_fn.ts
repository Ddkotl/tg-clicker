import { SupportedLang, translated_messages, TranslationKey } from "../translate_type";

export function translate(
  key: TranslationKey,
  language: SupportedLang = "en",
  vars?: Record<string, string | number>,
): string {
  const dict = translated_messages[language];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValue(obj: any, path: string): string {
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? path;
  }

  const raw = getValue(dict, key);

  if (!vars) return raw;

  return raw.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
}

export type TranslateFn = (key: TranslationKey, lang: SupportedLang, vars?: Record<string, string | number>) => string;
