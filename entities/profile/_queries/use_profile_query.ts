import { useQuery } from "@tanstack/react-query";
import { ProfileResponse } from "../_domain/types";
import { queries_keys } from "@/shared/lib/queries_keys";
import { api_path } from "@/shared/lib/paths";

export const useProfileQuery = (userId: string) => {
  return useQuery<ProfileResponse>({
    queryKey: queries_keys.profile_userId(userId),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch(api_path.get_profile(userId), { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return await res.json();
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
    enabled: !!userId,
  });
};
