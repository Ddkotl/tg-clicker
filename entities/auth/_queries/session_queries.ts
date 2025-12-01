import { useQuery } from "@tanstack/react-query";
import { SessionErrorResponseType, SessionResponseType } from "../_domain/types";
import { client_cash } from "@/shared/lib/cash/client_cash";
import { queries_keys } from "@/shared/lib/queries_keys";
import { api_path } from "@/shared/lib/paths";

export function useGetSessionQuery() {
  return useQuery<SessionResponseType | SessionErrorResponseType>({
    queryKey: queries_keys.session(),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch(api_path.get_session(), { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch session");
      }
      return res.json();
    },
    gcTime: client_cash.SESSION_QUERY_GC_TIME,
    staleTime: client_cash.SESSION_QUERY_STALE_TIME,
  });
}
