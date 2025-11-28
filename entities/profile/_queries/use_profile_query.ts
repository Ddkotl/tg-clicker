import { useQuery } from "@tanstack/react-query";
import { ProfileResponse } from "../_domain/types";

export const useProfileQuery = (userId: string) => {
  return useQuery<ProfileResponse>({
    queryKey: ["profile", userId],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch(`/api/user/profile${userId ? `?userId=${userId}` : ""}`, { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return await res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!userId,
  });
};
