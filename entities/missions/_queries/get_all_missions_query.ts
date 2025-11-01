import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export const getAllDailyMissionsQuery = (userId: string) => ({
  queryKey: queries_keys.daily_missions_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(api_path.get_daily_missions(userId), { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch getAllDailyMissionsQuery");
    }
    return res.json();
  },
});
