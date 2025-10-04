"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/lang_context";
import { useTranslation } from "@/hooks/use_translation";
import { Theme, useTheme } from "@/contexts/theme_context";

interface AuthResponse {
  message: string;
  language_code?: string;
  nikname?: string;
  color_theme?: Theme;
}

export default function TelegramAuth() {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const { isLoading, isError, data } = useQuery<AuthResponse, Error>({
    queryKey: ["telegramAuth"],
    queryFn: async () => {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.ready();
      const initData = WebApp.initData;
      const start_param = WebApp.initDataUnsafe.start_param;
      if (!initData) {
        throw new Error("No initData from Telegram WebApp");
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, start_param }),
        cache: "no-store",
      });

      if (!res.ok) {
        setLanguage("en");
        const json = await res.json();
        throw new Error(json?.message || "Authentication failed");
      }

      return res.json();
    },
    retry: 2,
    staleTime: 1000,
    gcTime: 1000,
  });

  useEffect(() => {
    if (data) {
      if (data.color_theme) {
        setTheme(data.color_theme);
        document.documentElement.classList.remove(
          "theme-red",
          "theme-purple",
          "theme-green",
          "theme-yellow",
          "theme-blue",
        );
        document.documentElement.classList.add(`theme-${theme}`);
      }
      if (data.language_code) {
        const lang = data.language_code.startsWith("ru") ? "ru" : "en";
        setLanguage(lang);
        // setLanguage("en");
      } else {
        setLanguage("en");
      }
      if (data.nikname) {
        router.push("/game");
      } else {
        router.push("/registration");
      }
    }
  }, [data, router, setLanguage, setTheme, theme]);

  if (isLoading) {
    return (
      <Image src="/loading.jpg" width={300} height={300} alt={t("loading")} />
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8 text-red-500">
        <p>{t("auth_error")}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {t("auth_error")}
        </button>
      </div>
    );
  }

  return (
    <Image src="/loading.jpg" width={300} height={300} alt={t("loading")} />
  );
}
