import { queries_keys } from "@/shared/lib/queries_keys";

export const getFactCountNocheckQuery = (userId: string) => ({
  queryKey: queries_keys.facts_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`/api/user/count_nocheck${userId ? `?userId=${userId}` : ""}`, { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch count_nocheck facts");
    }
    return res.json();
  },
});
