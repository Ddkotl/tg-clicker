"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/features/translations/lang_context";
import { Theme, useTheme } from "@/features/themes/theme_context";
import { useAuthQuery } from "../_queries/auth_query";
import { TelegramAuthLoading } from "./telegram_auth_loading";
import { TelegramAuthError } from "./telegram_auth_error";

export function TelegramAuth() {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const { isError, data } = useAuthQuery();

  useEffect(() => {
    if (data) {
      if (data.data?.color_theme) {
  const newTheme = data.data.color_theme as Theme;
  setTheme(newTheme);
  document.documentElement.classList.remove(
    "theme-red",
    "theme-purple",
    "theme-green",
    "theme-yellow",
    "theme-blue"
  );
  document.documentElement.classList.add(`theme-${newTheme}`);
}

      if (data.data?.language_code) {
        const lang = data.data?.language_code.startsWith("ru") ? "ru" : "en";
        setLanguage(lang);
      } else {
        setLanguage("en");
      }
      if (data.data?.nikname) {
        router.push("/game");
      } else {
        router.push("/registration");
      }
    }
  }, [data, router, setLanguage, setTheme, theme]);

  if (isError) {
    return <TelegramAuthError />;
  }

  return <TelegramAuthLoading />;
}
