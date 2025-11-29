"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getAllDailyMissionsQuery } from "../_queries/get_all_missions_query";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { GetDailyMissionsResponseType } from "../_domain/types";
import { useTranslation } from "@/features/translations/use_translation";
import { MissionCard } from "./mission_card";

export function DailyMissions() {
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();

  const { data: missions, isLoading: isMissionsLoading } = useQuery<GetDailyMissionsResponseType>({
    ...getAllDailyMissionsQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });

  if (isSessionLoading || isMissionsLoading) {
    return <ComponentSpinner />;
  }

  const missionList = missions?.data.missions ?? [];

  if (missionList.length === 0) {
    return <div>{t("headquarter.missions.no_missions")}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {missionList.map((mission) => (
        <MissionCard key={mission.id} mission={mission} t={t} />
      ))}
    </div>
  );
}
