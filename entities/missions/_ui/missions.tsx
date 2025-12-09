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
  const userId = session.data?.data?.user.userId;

  const missions = useMissionsQuery(userId || "");

  if (session.isLoading || missions.isLoading) {
    return <ComponentSpinner />;
  }

  const missionList = missions.data?.data.missions ?? [];

  const daily = missionList.filter((m) => m.time === MissionTime.DAILY);
  const permanent = missionList.filter((m) => m.time === MissionTime.PERMANENT);

  const noMissionsText = <div>{t("headquarter.missions.no_missions")}</div>;

  return (
    <Tabs defaultValue="daily">
      <TabsList className="w-full grid grid-cols-2 h-auto gap-2 bg-inherit shadow-2xl">
        <TabsTrigger value="daily" className="relative">
          <Title text={t("headquarter.missions.daily_missions")} align="center" size="sm" />
          {daily.length > 0 && <Counter count={daily.length} className="-top-1 -right-1" />}
        </TabsTrigger>

        <TabsTrigger value="permanents">
          <Title text={t("headquarter.missions.permanents")} align="center" size="sm" />
          {permanent.length > 0 && <Counter count={permanent.length} className="-top-1 -right-1" />}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        {daily.length === 0 ? (
          noMissionsText
        ) : (
          <div className="flex flex-col gap-2">
            {daily.map((mission) => (
              <MissionCard key={mission.id} mission={mission} t={t} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="permanents">
        {permanent.length === 0 ? (
          noMissionsText
        ) : (
          <div className="flex flex-col gap-2">
            {permanent.map((mission) => (
              <MissionCard key={mission.id} mission={mission} t={t} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
