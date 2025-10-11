import { useQuery } from "@tanstack/react-query";
import { AuthErrorResponseType, AuthResponseType } from "../_domain/types";

export function useAuthQuery() {
  return useQuery<AuthResponseType | AuthErrorResponseType>({
    queryKey: ["telegramAuth"],
    queryFn: async () => {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.ready();

      const initData = WebApp.initData;
      const start_param = WebApp.initDataUnsafe.start_param;

      if (!initData) throw new Error("No initData from Telegram WebApp");

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, ref: start_param }),
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.message || "Authentication failed");

      return json;
    },
  });
}
