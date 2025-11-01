import { useQuery } from "@tanstack/react-query";
import { AuthRequestType, AuthResponseType } from "../_domain/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";

export function useAuthQuery() {
  return useQuery<AuthResponseType | ErrorResponseType, AuthRequestType>({
    queryKey: queries_keys.tg_auth(),
    queryFn: async () => {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.ready();
      WebApp.disableVerticalSwipes();
      const initData = WebApp.initData;
      const start_param = WebApp.initDataUnsafe?.start_param;
      if (!initData) throw new Error("No initData from Telegram WebApp");

      const res = await fetch(api_path.auth(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, ref: start_param }),
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },
    gcTime: 10 * 1000,
    staleTime: 10 * 1000,
  });
}
