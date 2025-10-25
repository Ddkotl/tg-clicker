"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetSessionQuery } from "@/entities/auth";
import { FactCoutNocheckErrorResponseType, getFactCountNocheckQuery, useCheckAllFactsMutation } from "@/entities/facts";
import { queries_keys } from "@/shared/lib/queries_keys";
import { FactsAlert } from "./_ui/facts_alert";
import { useFactsSSE } from "./_vm/useFactsSSE";
import { MeditationInfoResponse } from "@/entities/meditation";
import { getMeditationInfoQuery } from "@/entities/meditation/_queries/get_meditation_info_query";
import { ProcessAlert } from "./_ui/process_alert";
import { useTranslation } from "../translations/use_translation";
import { ui_path } from "@/shared/lib/paths";

export function Notifications() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useCheckAllFactsMutation();
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();

  const userId = session?.data?.user.userId;

  const { data: facts_count, isLoading: isLoadingFacts } = useQuery<FactCoutNocheckErrorResponseType>({
    ...getFactCountNocheckQuery(userId ?? ""),
    enabled: !!userId,
  });

  const { data: meditation_info } = useQuery<MeditationInfoResponse>({
    ...getMeditationInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  useFactsSSE(userId);

  const handleCloseClick = () => {
    if (!userId) return;
    queryClient.removeQueries({ queryKey: queries_keys.facts_userId(userId) });
    mutation.mutate({ userId });
  };

  // Медитация
  const meditation = meditation_info?.data;
  const isMeditating = meditation?.on_meditation ?? false;
  let end: number | null = null;

  if (isMeditating && meditation?.start_meditation && meditation?.meditation_hours) {
    const start = new Date(meditation.start_meditation).getTime();
    end = start + meditation.meditation_hours * 60 * 60 * 1000;
  }

  const isLoading = isLoadingSession || isLoadingFacts;
  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Постоянный алерт если игрок медитирует */}
      {isMeditating && end && (
        <ProcessAlert
          endTime={end}
          onClose={handleCloseClick}
          href={ui_path.meditation_page()}
          description={t("headquarter.meditation_in_progress")}
          label={t("headquarter.remaining")}
        />
      )}

      {facts_count?.data !== undefined && facts_count?.data > 0 && (
        <FactsAlert count={facts_count?.data} onClose={handleCloseClick} />
      )}
    </div>
  );
}
