"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      WebApp.disableVerticalSwipes();
      if (["/", "/game"].includes(pathname)) {
        WebApp.BackButton.hide();
        return;
      }

      WebApp.BackButton.show();

      const handleBack = () => {
        router.back();
      };

      WebApp.BackButton.onClick(handleBack);

      return () => {
        WebApp.BackButton.offClick(handleBack);
        WebApp.BackButton.hide();
      };
    });
  }, [router, pathname]);
}
