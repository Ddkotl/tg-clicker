import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { useQuery } from "@tanstack/react-query";
import { GetDailyMissionsResponseType } from "../_domain/types";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";

export const useMissionsQuery = (userId: string) => {
  return useQuery<GetDailyMissionsResponseType, ErrorResponseType>({
    queryKey: queries_keys.daily_missions_userId(userId),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch(api_path.get_daily_missions(userId), { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch useMissionsQuery");
      }
      return res.json();
    },
    enabled: !!userId,
  });
};
