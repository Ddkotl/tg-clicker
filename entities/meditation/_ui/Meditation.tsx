"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { MeditationForm } from "./meditation-form";
import { TranslationKey } from "@/features/translations/translate_type";
import { getHoursString } from "../_vm/getHoursString";
import { useState } from "react";
import { calcMeditationReward } from "../_vm/calc_meditation_reward";
import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";
import { Spinner } from "@/shared/components/ui/spinner";

export function Meditation() {
  const [selectedHours, setSelectedHours] = useState("1");
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();

  const { data: profile, isLoading: isProfileLoading } = useQuery<ProfileResponse>({
    ...getProfileQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });

  if (isSessionLoading || isProfileLoading || profile?.data === null) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className=" flex flex-col gap-3">
      <PageDescription
        title={t("headquarter.meditation")}
        highlight={t("headquarter.meditation_desc")}
        text={t("headquarter.meditation_revard_promise", {
          qi_param: `${calcMeditationReward({
            power: profile?.data.power ?? 0,
            protection: profile?.data.protection ?? 0,
            speed: profile?.data.speed ?? 0,
            skill: profile?.data.skill ?? 0,
            qi_param: profile?.data.qi_param ?? 0,
            hours: +selectedHours,
          })}`,
          time: `${selectedHours} ${t(`hour.${getHoursString(+selectedHours)}` as TranslationKey)}`,
        })}
        img={img_paths.meditation()}
      />

      <MeditationForm onTimeChange={setSelectedHours} />
    </div>
  );
}
