import { SupportedLang } from "../translate_type";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export function getCookieLang({ headers }: { headers: ReadonlyHeaders }): SupportedLang {
  const lang = headers.get("x-user-language");
  if (lang === "ru") return "ru";
  return "en";
}
