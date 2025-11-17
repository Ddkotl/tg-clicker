"use client";

import { queries_keys } from "@/shared/lib/queries_keys";
import { useQuery } from "@tanstack/react-query";
import { OverallRatingsMAP_Type } from "../_domain/ratings_list";
import { api_path } from "@/shared/lib/paths";
import { RatingsOverallResponseType } from "../_domain/types";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";

export function useGetOverallRatingsQuery(type: OverallRatingsMAP_Type) {
  return useQuery<RatingsOverallResponseType, ErrorResponseType>({
    queryKey: queries_keys.ratings_type(type),
    queryFn: async () => {
      const res = await fetch(api_path.get_ratings(type));
      return res.json();
    },
    staleTime: 1000 * 60 * 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
