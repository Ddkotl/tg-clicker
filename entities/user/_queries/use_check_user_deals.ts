"use client";

import { useQuery } from "@tanstack/react-query";
import { useGetSessionQuery } from "@/entities/auth";
import { MeditationInfoErrorResponse, MeditationInfoResponse } from "@/entities/meditation";
import { getMeditationInfoQuery } from "@/entities/meditation/_queries/get_meditation_info_query";

export function useCheckUserDeals() {
  const { data: session } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const { data: meditation } = useQuery<MeditationInfoResponse, MeditationInfoErrorResponse>({
    ...getMeditationInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const on_meditation = meditation?.data?.on_meditation ?? false;

  return { on_meditation: on_meditation };
}
