"use client";

import { useQuery } from "@tanstack/react-query";
import { useGetSessionQuery } from "@/entities/auth";
import { MeditationInfoResponse } from "@/entities/meditation";
import { SpiritPathInfoResponseType } from "@/entities/spirit_path";
import { getMeditationInfoQuery } from "@/entities/meditation/_queries/get_meditation_info_query";
import { getSpiritPathInfoQuery } from "@/entities/spirit_path/_queries/get_spirit_path_info_query";
import { useTranslation } from "@/features/translations/use_translation";

export type CheckUserDealsStatus = {
  busy: boolean;
  reason?: string;
};

export function useCheckUserDealsStatus() {
  const { t } = useTranslation();
  const { data: session } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const { data: meditation } = useQuery<MeditationInfoResponse>({
    ...getMeditationInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const { data: spiritPath } = useQuery<SpiritPathInfoResponseType>({
    ...getSpiritPathInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  // Определяем текущий статус
  let status: CheckUserDealsStatus = { busy: false };

  if (meditation?.data?.on_meditation) {
    status = {
      busy: true,
      reason: t("headquarter.meditation_in_progress"),
    };
  } else if (spiritPath?.data?.on_spirit_paths) {
    status = {
      busy: true,
      reason: t("headquarter.spirit_path.spirit_path_in_progress"),
    };
  }

  return status;
}
