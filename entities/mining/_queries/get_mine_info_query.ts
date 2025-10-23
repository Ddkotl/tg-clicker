import { queries_keys } from "@/shared/lib/queries_keys";
import { useQueryClient } from "@tanstack/react-query";

export const getMineInfoQuery = (userId: string) => ({
  queryKey: queries_keys.mine_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`/api/headquarter/mine/status${userId ? `?userId=${userId}` : ""}`, { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch mine info");
    }
    return res.json();
  },
});

export const useInvalidateMine = () => {
  const queryClient = useQueryClient();

  return (userId: string) =>
    queryClient.invalidateQueries({
      queryKey: queries_keys.mine_userId(userId),
    });
};
