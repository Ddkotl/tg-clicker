import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCountInFrResponseType } from "../_domain/types";

export function useGetUsersCountInFractionsQuery() {
  return useQuery<UserCountInFrResponseType>({
    queryKey: ["getUsersCountInFractions"],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch("/api/statistics/users_count_in_fr", {
        signal,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch users_count_in_fr");
      }
      return res.json();
    },
  });
}

export const useInvalidateGetUserCountsInFractions = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["getUsersCountInFractions"],
    });
};
