"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      if (["/", "/game", "/registration"].includes(pathname)) {
        WebApp.BackButton.hide();
        return;
      }

      WebApp.BackButton.show();

      const handleBack = () => {
        router.back();
      };

      WebApp.BackButton.onClick(handleBack);
      WebApp.disableVerticalSwipes();
      return () => {
        WebApp.BackButton.offClick(handleBack);
        WebApp.BackButton.hide();
      };
    });
  }, [router, pathname]);
}
