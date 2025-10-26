"use client";

import { FactionConfrontationBar } from "./fraction_stats";
import { TranslationKey } from "@/features/translations/translate_type";
import { ProfileResponse } from "@/entities/profile";
import { UserCountInFrResponseType } from "@/entities/statistics";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";

export function WelcomeCard({
  t,
  isLoadingFractionCounts,
  profile,
  dataFractionCounts,
}: {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  isLoadingProfile: boolean;
  isLoadingFractionCounts: boolean;
  profile?: ProfileResponse;
  dataFractionCounts?: UserCountInFrResponseType;
}) {
  return (
    <>
      <PageDescription
        title={t("home.ready_to_battle")}
        text={`${t("home.welcome_wanderer")} ${profile?.data?.nikname}!  ${t("home.home_text")}`}
        img={img_paths.home()}
      />

      <FactionConfrontationBar isLoading={isLoadingFractionCounts} dataFractionCounts={dataFractionCounts} />
    </>
  );
}
