"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();
  const pathname = usePathname();
const handleBack = () => {
        try {
          router.back()
        } catch (err) {
          console.error("Telegram back handler error:", err);
        }
      };
  useEffect(() => {
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      const hideBackPaths = ["/", "/registration"];

      if (hideBackPaths.includes(pathname)) {
        WebApp.BackButton.hide();
        return;
      }

      WebApp.BackButton.show();

      // ✅ важно: Telegram сам вызывает handleBack — не нужно давать ему закрывать WebApp
      WebApp.BackButton.onClick(() => {
        handleBack();
      });

      // обрабатываем системную кнопку Android
      //const handleSystemBack = (event: PopStateEvent) => {
     //   event.preventDefault();
       // handleBack();
   //   };
    //  window.addEventListener("popstate", handleSystemBack);

      return () => {
        WebApp.BackButton.offClick(handleBack);
     //   window.removeEventListener("popstate", handleSystemBack);
      };
    });
  }, [router, pathname]);
}
