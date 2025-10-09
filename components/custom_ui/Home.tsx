"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery } from "@/querys/profile_queries";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "@/hooks/use_translation";
import Link from "next/link";
import { Button } from "../ui/button";
import { getUserCountsInFractionsQuery } from "@/querys/user_in_fraktion_count_querys";
import { SessionErrorResponse, SessionResponse } from "@/app/api/session/route";
import { getSessionQuery } from "@/querys/session_queries";
import {
  ProfileErrorResponse,
  ProfileResponse,
} from "@/app/api/user/profile/route";
import {
  FractionsErrorResponse,
  FractionsResponse,
} from "@/app/api/statistics/user_count_in_fraktion/route";

export default function Home() {
  const { t } = useTranslation();
  const { data: session } = useQuery<SessionResponse | SessionErrorResponse>({
    ...getSessionQuery(),
  });
  const { data: profile, isLoading: isLoadingProfile } = useQuery<
    ProfileResponse | ProfileErrorResponse
  >({
    ...getProfileQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });
  const { data: dataFraktionCounts, isLoading: isLoadingFractionCounts } =
    useQuery<FractionsResponse | FractionsErrorResponse>({
      ...getUserCountsInFractionsQuery(),
    });
  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-2">
          <CardTitle className="text-primary text-lg font-bold">
            {t("home.ready_to_battle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          <div>
            <b>{t("mentor")}</b>
            {t("home.welcome_wanderer")}
            <b className="text-primary">
              {isLoadingProfile ? (
                <Skeleton className="mx-2 h-3 w-8  inline-block align-middle" />
              ) : (
                ` ${profile?.data?.nikname}`
              )}
            </b>
            <span>! </span>
            {t("home.balance_of_pover")}
            <span className="text-primary font-semibold">
              {t("fraction.adepts")} –{" "}
              {isLoadingFractionCounts ? (
                <Skeleton className="mx-2 h-3 w-8  inline-block align-middle" />
              ) : (
                ` ${dataFraktionCounts?.data?.adepts} ,`
              )}
            </span>
            <span className="text-primary font-semibold">
              {t("fraction.novices")} –{" "}
              {isLoadingFractionCounts ? (
                <Skeleton className="mx-2 h-3 w-8  inline-block align-middle" />
              ) : (
                ` ${dataFraktionCounts?.data?.novices} .`
              )}
            </span>
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

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: `📜 ${t("home.navigation.chronicles")}`, href: "/facts" },
          { label: `⚔️ ${t("home.navigation.battle")}`, href: "/battle" },
          {
            label: `🏰 ${t("home.navigation.headquarters")}`,
            href: "/game/headquarter",
          },
          { label: `🌆 ${t("home.navigation.city")}`, href: "/city" },
          { label: `🕵️ ${t("home.navigation.secret_agent")}`, href: "/agent" },
          { label: `🏆 ${t("home.navigation.rating")}`, href: "/ranking" },
        ].map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button asChild className="w-full bg-primary/70" size="lg">
              <span>{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
