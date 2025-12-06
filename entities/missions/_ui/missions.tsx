"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getAllDailyMissionsQuery } from "../_queries/get_all_missions_query";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { GetDailyMissionsResponseType } from "../_domain/types";
import { useTranslation } from "@/features/translations/use_translation";
import { MissionCard } from "./mission_card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Title } from "@/shared/components/custom_ui/title";
import { Counter } from "./counter";

export function Missions() {
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
    <Tabs defaultValue="daily">
      <TabsList className="w-full grid grid-cols-2 h-auto gap-2 bg-inherit shadow-2xl">
        <TabsTrigger value="daily" className="relative">
          <Title text={t("headquarter.missions.daily_missions")} align="center" size="sm" />
          {missionList.length && missionList.length >= 0 && (
            <Counter count={missionList.length} className="-top-1 -right-1" />
          )}
        </TabsTrigger>
        <TabsTrigger value="permanents">
          {" "}
          <Title text={t("headquarter.missions.permanents")} align="center" size="sm" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        <div className="flex flex-col gap-2">
          {missionList.map((mission) => (
            <MissionCard key={mission.id} mission={mission} t={t} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="permanents">
        <Title text={t("profile.statistics")} align="center" size="md" />
        <div>permanent</div>
      </TabsContent>
    </Tabs>
  );
}
