"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FractionStats } from "./fraction_stats";
import { TranslationKey } from "@/features/translations/translate_type";
import { ProfileResponse } from "@/entities/profile";
import { UserCountInFrResponseType } from "@/entities/statistics";

export function WelcomeCard({
  t,
  isLoadingProfile,
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
    <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
      <CardHeader className="px-2">
        <CardTitle className="text-primary text-lg font-bold">{t("home.ready_to_battle")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
        <div>
          <b className="text-base text-primary">{t("mentor")}</b> {t("home.welcome_wanderer")}
          <b className="text-primary">
            {isLoadingProfile ? (
              <Skeleton className="mx-2 h-3 w-8 inline-block align-middle" />
            ) : (
              ` ${profile?.data?.nikname}`
            )}
          </b>
          <span>! </span>
          {t("home.balance_of_pover")}
          <FractionStats
            t={t}
            isLoadingFractionCounts={isLoadingFractionCounts}
            dataFractionCounts={dataFractionCounts}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded-lg text-center">
            {t("home.adepts_loses")} <b>0</b>
          </div>
          <div className="p-2 bg-muted rounded-lg text-center">
            {t("home.novise_loses")} <b>0</b>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
