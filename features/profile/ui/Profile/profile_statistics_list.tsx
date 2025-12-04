"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Title } from "@/shared/components/custom_ui/title";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useGetUserPeriodStats } from "@/entities/statistics/_queries/use_get_user_period_stats";
import { TranslationKey } from "@/features/translations/translate_type";
import { UserStatsType } from "@/entities/statistics/_domain/types";
import { ProfileParam } from "./profile_param";
import { icons } from "@/shared/lib/icons";

interface Props {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  userId: string;
  isMyProfile: boolean;
}

export function ProfileStatisticsList({ t, userId, isMyProfile }: Props) {
  const [period, setPeriod] = useState<UserStatsType>("overall");

  // Загружаем статистику для выбранного периода
  const { data, isLoading } = useGetUserPeriodStats({ type: period, userId });

  if (isLoading) return <ComponentSpinner />;

  const stats = data?.data.stats;
  const params = [
    { icon: icons.lvl, text: t("experience"), value: stats?.exp ?? 0 },
    {
      icon: icons.fight,
      iconClassName: "text-gold-700/80",
      text: t("profile.stats.wins"),
      value: stats?.fights_wins ?? 0,
    },
    {
      icon: icons.defeat,
      text: t("profile.stats.defeats"),
      value: Math.min(0, (stats?.fights_total ?? 0) - (stats?.fights_wins ?? 0)),
    },
    {
      icon: icons.qi_energy,
      text: t("profile.stats.looted"),
      value: stats?.qi_looted ?? 0,
    },
    {
      icon: icons.qi_energy,
      text: t("profile.stats.lost"),
      value: stats?.qi_lost ?? 0,
    },
    {
      icon: icons.stone,
      text: t("profile.stats.looted"),
      value: stats?.qi_stone_looted ?? 0,
    },
    {
      icon: icons.stone,
      text: t("profile.stats.lost"),
      value: stats?.qi_stone_lost ?? 0,
    },
    {
      icon: icons.stone,
      text: t("profile.stats.mined_stones"),
      value: stats?.mined_qi_stone ?? 0,
    },
    {
      icon: icons.missions,
      text: t("profile.stats.missions"),
      value: stats?.missions ?? 0,
    },
    {
      icon: icons.meditation,
      iconClassName: "text-blue-700/80",
      text: t("profile.stats.meditation"),
      value: stats?.meditated_hours ?? 0,
    },
    {
      icon: icons.spirit_path,
      iconClassName: "text-indigo-700/80",
      text: t("profile.stats.spirit_path"),
      value: stats?.spirit_path_minutes ?? 0,
    },
  ];
  return (
    <div className="flex flex-col gap-4 w-full">
      {isMyProfile ? (
        <Tabs value={period} onValueChange={(v) => setPeriod(v as UserStatsType)}>
          <TabsList className="w-full grid grid-cols-2 h-auto gap-2 bg-inherit shadow-2xl">
            <TabsTrigger value="overall">
              <Title text={t("profile.stats.overall")} size="sm" align="center" />
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Title text={t("profile.stats.daily")} size="sm" align="center" />
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <Title text={t("profile.stats.weekly")} size="sm" align="center" />
            </TabsTrigger>
            <TabsTrigger value="monthly">
              <Title text={t("profile.stats.monthly")} size="sm" align="center" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <Title text={t("ranking.ratings.overall_game_rating")} size="md" align="center" />
      )}

      {/* Вывод статистики */}
      <div className="flex flex-col gap-1 text-center">
        {params.map((st, idx) => (
          <ProfileParam key={idx} label={st.text} value={st.value} icon={st.icon} iconClassName={st.iconClassName} />
        ))}
      </div>
    </div>
  );
}
