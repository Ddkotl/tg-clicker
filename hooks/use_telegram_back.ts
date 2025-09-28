"use cleint";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useTelegramBack() {
  const router = useRouter();

  useEffect(() => {
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
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
  }, [router]);
}
