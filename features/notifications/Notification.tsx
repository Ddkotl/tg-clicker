"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetSessionQuery } from "@/entities/auth";
import { FactCoutNocheckResponseType, getFactCountNocheckQuery, useCheckAllFactsMutation } from "@/entities/facts";
import { FactsAlert } from "./_ui/facts_alert";
import { useFactsSSE } from "./_vm/useFactsSSE";
import { MeditationInfoResponse } from "@/entities/meditation";
import { getMeditationInfoQuery } from "@/entities/meditation/_queries/get_meditation_info_query";
import { ProcessAlert } from "./_ui/process_alert";
import { useTranslation } from "../translations/use_translation";
import { ui_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { GetMineResponseType } from "@/entities/mining";
import { getMineInfoQuery } from "@/entities/mining/_queries/get_mine_info_query";
import { ActionAlert } from "./_ui/action_alert";
import { icons } from "@/shared/lib/icons";
import { getSpiritPathInfoQuery, SpiritPathInfoResponseType } from "@/entities/spirit_path";
import { useProfileHPUpdate } from "../hp_regen/use_xp_update";
import { getAllDailyMissionsQuery, GetDailyMissionsResponseType } from "@/entities/missions";
import { useMidnightUpdate } from "./_vm/useMidnightUpdate";
import { useQiRegen } from "../qi_regen/use_qi_update";
import { getUserQiSkillsQuery, GetUserQiSkillsResponseType } from "@/entities/qi_skiils";

export function Notifications() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useCheckAllFactsMutation();
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();

  const userId = session?.data?.user.userId;

  const { data: facts_count, isLoading: isLoadingFacts } = useQuery<FactCoutNocheckResponseType>({
    ...getFactCountNocheckQuery(userId ?? ""),
    enabled: !!userId,
  });

  const { data: meditation_info, isLoading: isLoadingMeditation } = useQuery<MeditationInfoResponse>({
    ...getMeditationInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const { data: spirit_path_info, isLoading: isLoadingPathInfo } = useQuery<SpiritPathInfoResponseType>({
    ...getSpiritPathInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const { data: mine, isLoading: isLoadingMine } = useQuery<GetMineResponseType>({
    ...getMineInfoQuery(userId ?? ""),
    enabled: !!userId,
  });
  const { data: mission, isLoading: isLoadingMission } = useQuery<GetDailyMissionsResponseType>({
    ...getAllDailyMissionsQuery(userId ?? ""),
    enabled: !!userId,
  });
  const { isLoading: isLoadingQiSkills } = useQuery<GetUserQiSkillsResponseType>({
    ...getUserQiSkillsQuery(userId ?? ""),
    enabled: !!userId,
  });
  useProfileHPUpdate(userId);
  useQiRegen(userId);
  useFactsSSE(userId);
  useMidnightUpdate(userId);

  const handleCloseClick = () => {
    if (!userId) return;
    queryClient.removeQueries({
      queryKey: queries_keys.facts_userId(userId),
    });
    mutation.mutate({ userId });
  };
  // spirit path
  const spirit_path = spirit_path_info?.data;
  const isSpiritPath = spirit_path?.on_spirit_paths ?? false;
  let spirit_path_end: number | null = null;

  if (isSpiritPath && spirit_path?.start_spirit_paths && spirit_path?.spirit_paths_minutes) {
    const start = new Date(spirit_path.start_spirit_paths).getTime();
    spirit_path_end = start + spirit_path.spirit_paths_minutes * 60 * 1000;
  }
  // Медитация
  const meditation = meditation_info?.data;
  const isMeditating = meditation?.on_meditation ?? false;
  let end: number | null = null;

  if (isMeditating && meditation?.start_meditation && meditation?.meditation_hours) {
    const start = new Date(meditation.start_meditation).getTime();
    end = start + meditation.meditation_hours * 60 * 60 * 1000;
  }

  const isLoading = isLoadingSession || isLoadingFacts || isLoadingMeditation || isLoadingPathInfo || isLoadingQiSkills;
  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Постоянный алерт если игрок медитирует */}
      {isMeditating && end && (
        <ProcessAlert
          icon={icons.meditation({
            className: "h-5 w-5 text-primary shrink-0",
          })}
          endTime={end}
          href={ui_path.meditation_page()}
          description={t("headquarter.meditation_in_progress")}
          label={t("headquarter.remaining")}
        />
      )}
      {isSpiritPath && spirit_path_end && (
        <ProcessAlert
          icon={icons.spirit_path({
            className: "h-5 w-5 text-primary shrink-0",
          })}
          endTime={spirit_path_end}
          href={ui_path.spirit_path_page()}
          description={t("headquarter.spirit_path.spirit_path_in_progress")}
          label={t("headquarter.remaining")}
        />
      )}

      {facts_count?.data !== undefined && facts_count?.data > 0 && (
        <FactsAlert count={facts_count?.data} onClose={handleCloseClick} />
      )}
      {!isLoadingMine && mine?.data.energy !== undefined && mine?.data.energy > 0 && (
        <ActionAlert
          icon={icons.mine({})}
          title={t("facts.notification.you_have_energy")}
          actionText={t("facts.notification.go_to_the_mine")}
          href={ui_path.mine_page()}
          className="shine-effect"
        />
      )}
      {!isLoadingMission && mission?.data.missions.length !== 0 && (
        <ActionAlert
          icon={icons.missions({
            className: "text-primary",
          })}
          title={t("facts.notification.new_missions")}
          actionText={t("facts.notification.go_to_missions")}
          href={ui_path.missions_page()}
          className="shine-effect"
        />
      )}
    </div>
  );
}
