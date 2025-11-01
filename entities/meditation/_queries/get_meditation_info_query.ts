import { queries_keys } from "@/shared/lib/queries_keys";

export const getMeditationInfoQuery = (userId: string) => ({
  queryKey: queries_keys.meditation_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`/api/headquarter/meditation${userId ? `?userId=${userId}` : ""}`, { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch meditation info");
    }
    return res.json();
  },
});
