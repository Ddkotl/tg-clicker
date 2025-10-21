"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();
  const pathname = usePathname();
  const initializedRef = useRef(false); // флаг, чтобы не подписываться повторно

  useEffect(() => {
    let WebApp: any;
    const hideBackPaths = ["/", "/registration"];

    const handleBack = () => {
      try {
        console.log("🔙 Telegram Back pressed on:", pathname);
        router.back();
      } catch (err) {
        console.error("Telegram back handler error:", err);
      }
    };

    (async () => {
      const sdk = await import("@twa-dev/sdk");
      WebApp = sdk.default;

      if (hideBackPaths.includes(pathname)) {
        console.log("🙈 Скрываю кнопку назад на маршруте:", pathname);
        WebApp.BackButton.hide();
        return;
      }

      WebApp.BackButton.show();

      // предотвращаем множественные подписки
      if (!initializedRef.current) {
        WebApp.BackButton.onClick(handleBack);
        initializedRef.current = true;
        console.log("✅ Telegram Back Button подписан");
      }
    })();

    return () => {
      if (WebApp && initializedRef.current) {
        WebApp.BackButton.offClick(handleBack);
        initializedRef.current = false;
        console.log("🧹 Очистка подписки Back Button");
      }
    };
  }, [pathname]);
}
