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
import { useCheckSubscription } from "@/features/missions/mutations/use_check_subscription";

export function Missions() {
  const { t, language } = useTranslation();
  const session = useGetSessionQuery();
  const userId = session.data?.data?.user.userId;

  const missions = useMissionsQuery(userId || "");

  const check_sub_mutation = useCheckSubscription();

  if (session.isLoading || missions.isLoading) {
    return <ComponentSpinner />;
  }

  const missionList = missions.data?.data.missions ?? [];
  const daily_missions = missionList.filter((e) => e.time === MissionTime.DAILY);
  const permanent_missions = missionList.filter((e) => e.time === MissionTime.PERMANENT && e.chanel_lang === language);
  if (missionList.length === 0) {
    return <div>{t("headquarter.missions.no_missions")}</div>;
  }

  return (
    <Tabs defaultValue="daily">
      <TabsList className="w-full grid grid-cols-2 h-auto gap-2 bg-inherit shadow-2xl">
        <TabsTrigger value="daily" className="relative">
          <Title text={t("headquarter.missions.daily_missions")} align="center" size="sm" />
          {daily_missions.length >= 0 && <Counter count={daily_missions.length} className="-top-1 -right-1" />}
        </TabsTrigger>

        <TabsTrigger value="permanents" className="relative">
          <Title text={t("headquarter.missions.permanents")} align="center" size="sm" />
          {permanent_missions.length >= 0 && <Counter count={permanent_missions.length} className="-top-1 -right-1" />}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <div className="flex flex-col gap-2 items-center ">
          {daily_missions.length <= 0 && <div>{t("headquarter.missions.no_missions")}</div>}
          {daily_missions.length >= 0 &&
            daily_missions.map((mission) => <MissionCard key={mission.id} mission={mission} t={t} />)}
        </div>
      </TabsContent>

      <TabsContent value="permanents">
        <div className="flex flex-col gap-2 items-center ">
          {permanent_missions.length <= 0 && <div>{t("headquarter.missions.no_missions")}</div>}
          {permanent_missions.length > 0 &&
            permanent_missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                t={t}
                mutate={() => check_sub_mutation.mutate({ missionId: mission.id })}
                isMutatePending={check_sub_mutation.isPending}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
