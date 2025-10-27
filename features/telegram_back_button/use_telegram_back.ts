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
    const blockBackPaths = ["/game"];

    const handleBack = () => {
      try {
        if (blockBackPaths.includes(pathname)) {
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
        WebApp.BackButton.hide();

        if (initializedRef.current) {
          WebApp.BackButton.offClick(handleBack);
          initializedRef.current = false;
        }

        return;
      }

      WebApp.BackButton.show();

      if (!initializedRef.current) {
        WebApp.BackButton.onClick(handleBack);
        initializedRef.current = true;
      }
    })();

    return () => {
      if (WebApp && initializedRef.current) {
        WebApp.BackButton.offClick(handleBack);
        initializedRef.current = false;
      }
    };
  }, [pathname, router]);
}
