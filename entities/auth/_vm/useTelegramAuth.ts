import { ui_path } from "@/shared/lib/paths";
import { useEffect } from "react";
import { useAuthQuery } from "../_queries/auth_query";
import { Theme, useTheme } from "@/features/themes/theme_context";
import { useLanguage } from "@/features/translations/lang_context";
import { useRouter } from "next/navigation";

export function useTelegramAuth() {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const { setTheme } = useTheme();
  const { isError, data } = useAuthQuery();

  useEffect(() => {
    const themeValue = data?.data?.color_theme as Theme | undefined;
    if (themeValue) {
      setTheme(themeValue);
    }
  }, [data?.data?.color_theme, setTheme]);

  useEffect(() => {
    const langCode = data?.data?.language_code;
    if (langCode) {
      const lang = langCode.startsWith("ru") ? "ru" : "en";
      setLanguage(lang);
    }
  }, [data?.data?.language_code, setLanguage]);

  useEffect(() => {
    if (!data?.data) return;
    const target = data.data.nikname ? ui_path.home_page() : ui_path.registration_page();
    router.replace(target);
  }, [data?.data, router]);
  return { isError };
}
