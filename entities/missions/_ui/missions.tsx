"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useMissionsQuery } from "../_queries/get_all_missions_query";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useTranslation } from "@/features/translations/use_translation";
import { MissionCard } from "./mission_card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Title } from "@/shared/components/custom_ui/title";
import { MissionTime } from "@/_generated/prisma/enums";
import { Counter } from "@/shared/components/custom_ui/counter";

export function Missions() {
  const { t } = useTranslation();
  const session = useGetSessionQuery();

  const missions = useMissionsQuery(session.data?.data?.user.userId || "");

  if (session.isLoading || missions.isLoading) {
    return <ComponentSpinner />;
  }

  const missionList = missions.data?.data.missions ?? [];

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
          {missionList.map((mission) =>
            mission.time === MissionTime.DAILY ? (
              <MissionCard key={mission.id} mission={mission} t={t} />
            ) : (
              <div>{t("headquarter.missions.no_missions")}</div>
            ),
          )}
        </div>
      </TabsContent>
      <TabsContent value="permanents">
        {missionList.map((mission) =>
          mission.time === MissionTime.PERMANENT ? (
            <MissionCard key={mission.id} mission={mission} t={t} />
          ) : (
            <div>{t("headquarter.missions.no_missions")}</div>
          ),
        )}
      </TabsContent>
    </Tabs>
  );
}
