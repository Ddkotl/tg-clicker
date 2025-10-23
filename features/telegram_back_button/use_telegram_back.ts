"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();
  const pathname = usePathname();
  const initializedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let WebApp: any;
    const hideBackPaths = ["/", "/registration"];
    const blockBackPaths = ["/game"]; // 👈 тут блокируем возврат с game

    const handleBack = () => {
      try {
        console.log("🔙 Telegram Back pressed on:", pathname);

        // 🚫 блокируем возврат с /game
        if (blockBackPaths.includes(pathname)) {
          console.log("🚫 Возврат с /game запрещён — ничего не делаем");
          // если хочешь — можно просто закрыть Mini App:
          // WebApp.close();
          return;
        }

        router.back();
      } catch (err) {
        console.error("Telegram back handler error:", err);
      }
    };

    (async () => {
      const sdk = await import("@twa-dev/sdk");
      WebApp = sdk.default;

      if (hideBackPaths.includes(pathname)) {
        console.log("🙈 Скрываю Telegram Back на маршруте:", pathname);
        WebApp.BackButton.hide();

        if (initializedRef.current) {
          WebApp.BackButton.offClick(handleBack);
          initializedRef.current = false;
          console.log("🧹 Удалил обработчик Back");
        }

        return;
      }

      WebApp.BackButton.show();

      if (!initializedRef.current) {
        WebApp.BackButton.onClick(handleBack);
        initializedRef.current = true;
        console.log("✅ Telegram Back Button активна на:", pathname);
      }
    })();

    return () => {
      if (WebApp && initializedRef.current) {
        WebApp.BackButton.offClick(handleBack);
        initializedRef.current = false;
        console.log("🧹 Очистка обработчика Back при размонтировании");
      }
    };
  }, [pathname, router]);
}
