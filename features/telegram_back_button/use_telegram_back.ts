"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();
  const pathname = usePathname();
  const history = useRef<string[]>([]);

  useEffect(() => {
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      WebApp.disableVerticalSwipes();

      // обновляем историю, если изменился маршрут
      if (history.current[history.current.length - 1] !== pathname) {
        history.current.push(pathname);
      }

      const hideBackPaths = ["/", "/registration"];
      const closeWebAppPaths = ["/game"];

      if (hideBackPaths.includes(pathname)) {
        WebApp.BackButton.hide();
        return;
      }

      WebApp.BackButton.show();

      const handleBack = () => {
        // Telegram WebApp иногда перехватывает onClick → защищаемся
        try {
          // если текущая страница — та, где нужно закрыть WebApp
          if (closeWebAppPaths.includes(pathname)) {
            WebApp.close();
            return;
          }

          // иначе — просто перейти назад по истории
          history.current.pop();
          const prevPath = history.current.pop() || "/";

          // важный момент: используем replace(), чтобы не мигал экран
          router.replace(prevPath);
        } catch (err) {
          console.error("Telegram back handler error:", err);
        }
      };

      // ✅ важно: Telegram сам вызывает handleBack — не нужно давать ему закрывать WebApp
      WebApp.BackButton.onClick(() => {
        handleBack();
      });

      // обрабатываем системную кнопку Android
      const handleSystemBack = (event: PopStateEvent) => {
        event.preventDefault();
        handleBack();
      };
      window.addEventListener("popstate", handleSystemBack);

      return () => {
        WebApp.BackButton.offClick(handleBack);
        window.removeEventListener("popstate", handleSystemBack);
      };
    });
  }, [router, pathname]);
}
