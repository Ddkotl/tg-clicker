"use client";

import { queries_keys } from "@/shared/lib/queries_keys";
import { useQuery } from "@tanstack/react-query";
import { RatingsMetrics, RatingsTypes } from "../_domain/ratings_list_items";
import { api_path } from "@/shared/lib/paths";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { RatingsResponseType } from "../_domain/types";

export function useGetRatingsQuery(type: RatingsTypes, metric: RatingsMetrics, page: number) {
  return useQuery<RatingsResponseType, ErrorResponseType>({
    queryKey: queries_keys.ratings_type(type, metric, page),
    queryFn: async () => {
      const res = await fetch(api_path.get_ratings(type, metric, page));
      return res.json();
    },
    staleTime: 1000 * 60 * 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
