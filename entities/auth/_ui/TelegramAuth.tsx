"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/features/translations/lang_context";
import { Theme, useTheme } from "@/features/themes/theme_context";
import { useAuthQuery } from "../_queries/auth_query";
import { TelegramAuthLoading } from "./telegram_auth_loading";
import { TelegramAuthError } from "./telegram_auth_error";
import { ui_path } from "@/shared/lib/paths";

export function TelegramAuth() {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const { setTheme } = useTheme();
  const { isError, data } = useAuthQuery();

  // ✅ Применяем тему из API
  useEffect(() => {
    const themeValue = data?.data?.color_theme as Theme | undefined;
    if (themeValue) {
      setTheme(themeValue);
    }
  }, [data?.data?.color_theme, setTheme]);

  // ✅ Применяем язык из API
  useEffect(() => {
    const langCode = data?.data?.language_code;
    if (langCode) {
      const lang = langCode.startsWith("ru") ? "ru" : "en";
      setLanguage(lang);
    }
  }, [data?.data?.language_code, setLanguage]);

  // ✅ Навигация после авторизации
  useEffect(() => {
    if (!data?.data) return;
    const target = data.data.nikname ? ui_path.home_page() : ui_path.registration_page();
    router.replace(target);
  }, [data?.data, router]);

  if (isError) return <TelegramAuthError />;
  return <TelegramAuthLoading />;
}
