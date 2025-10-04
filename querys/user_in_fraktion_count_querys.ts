import { useQueryClient } from "@tanstack/react-query";

export const getUserCountsInFractionsQuery = () => ({
  queryKey: ["getUserCountsInFractions"],
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch("/api/statistics/user_count_in_fraktion", {
      signal,
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user_count_in_fraktion");
    }
    return res.json();
  },
});

export const useInvalidateGetUserCountsInFractions = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["getUserCountsInFractions"],
    });
};
