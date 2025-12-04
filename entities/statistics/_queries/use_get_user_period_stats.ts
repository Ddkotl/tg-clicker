"use client";

import { queries_keys } from "@/shared/lib/queries_keys";
import { useQuery } from "@tanstack/react-query";
import { api_path } from "@/shared/lib/paths";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { UserStatsResponse, UserStatsType } from "../_domain/types";

export function useGetUserPeriodStats({ userId, type }: { userId: string; type: UserStatsType }) {
  return useQuery<UserStatsResponse, ErrorResponseType>({
    queryKey: queries_keys.user_stats(type, userId),
    queryFn: async () => {
      const res = await fetch(api_path.get_user_stats(type, userId));
      return res.json();
    },
    staleTime: 1000 * 60 * 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}
