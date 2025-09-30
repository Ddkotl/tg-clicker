"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getUserCountsInFractionsType,
  getUserProfileByTgIdType,
} from "@/repositories/user_repository";
import { getProfileQuery } from "@/querys/profile_queries";
import { Skeleton } from "./ui/skeleton";
import { useTranslation } from "@/hooks/use_translation";
import Link from "next/link";
import { Button } from "./ui/button";
import { getUserCountsInFractionsQuery } from "@/querys/user_in_fraktion_count_querys";

export default function Home() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery<getUserProfileByTgIdType>({
    ...getProfileQuery(),
  });
  const { data: dataFraktionCounts, isLoading: isLoadingFractionCounts } =
    useQuery<getUserCountsInFractionsType>({
      ...getUserCountsInFractionsQuery(),
    });
  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      <Card className="p-1 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-1">
          <CardTitle className="text-primary text-lg font-bold">
            {t("home.ready_to_battle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-1 text-sm leading-relaxed text-card-foreground">
          <div>
            <b>{t("home.mentor")}</b>
            {t("home.welcome_wanderer")}
            <b className="text-primary">
              {isLoading ? (
                <Skeleton className="mx-2 h-3 w-8 bg-primary/40 inline-block align-middle" />
              ) : (
                ` ${data?.profile?.nikname} !`
              )}
            </b>
            {t("home.balance_of_pover")}
            <span className="text-primary font-semibold">
              {t("fraction.adepts")} –{" "}
              {isLoadingFractionCounts ? (
                <Skeleton className="mx-2 h-3 w-8 bg-primary/40 inline-block align-middle" />
              ) : (
                ` ${dataFraktionCounts?.adepts} ,`
              )}
            </span>
            <span className="text-primary font-semibold">
              {t("fraction.novices")} –{" "}
              {isLoadingFractionCounts ? (
                <Skeleton className="mx-2 h-3 w-8 bg-primary/40 inline-block align-middle" />
              ) : (
                ` ${dataFraktionCounts?.novices} .`
              )}
            </span>
            {/* {!isLoadingFractionCounts && dataFraktionCounts !== undefined && (
              <div className="mt-2 flex h-3 rounded overflow-hidden bg-muted">
                <div
                  className="bg-red-500"
                  style={{
                    width: `${
                      ((dataFraktionCounts.adepts ?? 0) /
                        ((dataFraktionCounts.adepts ?? 0) +
                          (dataFraktionCounts.novices ?? 0))) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="bg-blue-500"
                  style={{
                    width: `${
                      ((dataFraktionCounts?.novices ?? 0) /
                        ((dataFraktionCounts?.adepts ?? 0) +
                          (dataFraktionCounts?.novices ?? 0))) *
                      100
                    }%`,
                  }}
                />
              </div>
            )} */}
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
          { label: `🏰 ${t("home.navigation.headquarters")}`, href: "/hq" },
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
