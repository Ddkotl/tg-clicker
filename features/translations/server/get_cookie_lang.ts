import { NextRequest } from "next/server";
import { SupportedLang } from "../translate_type";

export function getCookieLang(req: NextRequest): SupportedLang {
  const lang = req.headers.get("x-user-language");
  if (lang === "ru") return "ru";
  return "en";
}
