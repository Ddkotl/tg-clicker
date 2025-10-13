"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { MeditationForm } from "./meditation-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TranslationKey } from "@/features/translations/translate_type";
import { getHoursString } from "./getHoursString";
import { useState } from "react";
import { calcMeditationReward } from "../_vm/calc_meditation_reward";
import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function Meditation() {
  const [selectedHours, setSelectedHours] = useState("1");
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();

  const { data: profile, isLoading: isProfileLoading } =
    useQuery<ProfileResponse>({
      ...getProfileQuery(session?.data?.user.userId ?? ""),
      enabled: !!session?.data?.user.userId,
    });
  const isLoading = isSessionLoading || isProfileLoading;
  return (
    <div className=" flex flex-col gap-3">
      <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-2">
          <CardTitle className="text-primary text-lg font-bold">
            {t("headquarter.meditation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          <span className="text-primary text-md font-bold">{t("mentor")} </span>
          <span>{t("headquarter.meditation_desc")}</span>
          <p>
            {!profile?.data || isLoading ? (
              <Skeleton className="w-10 h-3 px-2" />
            ) : (
              t("headquarter.meditation_revard_promise", {
                mana: `${calcMeditationReward({
                  power: profile?.data.power ?? 0,
                  protection: profile?.data.protection ?? 0,
                  speed: profile?.data.speed ?? 0,
                  skill: profile?.data.skill ?? 0,
                  qi: profile?.data.qi ?? 0,
                  hours: +selectedHours,
                })}`,
                time: `${selectedHours} ${t(`hour.${getHoursString(+selectedHours)}` as TranslationKey)}`,
              })
            )}
          </p>
        </CardContent>
      </Card>
      <MeditationForm onTimeChange={setSelectedHours} />
    </div>
  );
}
