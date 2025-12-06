import { Facts } from "@/_generated/prisma/client";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export const getFactsInfiniteQuery = (userId: string, pageSize: number) => ({
  queryKey: [...queries_keys.facts_userId(userId), pageSize],
  queryFn: async ({ pageParam = 1, signal }: { pageParam?: number; signal?: AbortSignal }) => {
    const res = await fetch(api_path.get_facts(userId, pageParam, pageSize), { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch facts");
    }
    return res.json();
  },
  getNextPageParam: (lastPage: { nextPage: number | null; data: Facts[] }) => lastPage.nextPage ?? undefined,
  staleTime: 5 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
