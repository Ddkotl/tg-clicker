"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { useGetUsersCountInFractionsQuery } from "@/entities/statistics";
import { useTranslation } from "@/features/translations/use_translation";
import { WelcomeCard } from "./_ui/welcome_card";
import { HomeNav } from "./_ui/home_nav";
import { HomeNavItemType } from "./_domain/types";

export default function Home() {
  const { t } = useTranslation();
  const { data: session } = useGetSessionQuery();

  const { data: profile, isLoading: isLoadingProfile } =
    useQuery<ProfileResponse>({
      ...getProfileQuery(session?.data?.user.userId ?? ""),
      enabled: !!session?.data?.user.userId,
    });

  const { data: dataFractionCounts, isLoading: isLoadingFractionCounts } =
    useGetUsersCountInFractionsQuery();

  const home_nav_items: HomeNavItemType[] = [
    { label: `📜 ${t("home.navigation.chronicles")}`, href: "/facts" },
    { label: `⚔️ ${t("home.navigation.battle")}`, href: "/battle" },
    {
      label: `🏰 ${t("home.navigation.headquarters")}`,
      href: "/game/headquarter",
    },
    { label: `🌆 ${t("home.navigation.city")}`, href: "/city" },
    { label: `🕵️ ${t("home.navigation.secret_agent")}`, href: "/agent" },
    { label: `🏆 ${t("home.navigation.rating")}`, href: "/ranking" },
  ];

  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      <WelcomeCard
        t={t}
        isLoadingProfile={isLoadingProfile}
        isLoadingFractionCounts={isLoadingFractionCounts}
        profile={profile}
        dataFractionCounts={dataFractionCounts}
      />
      <HomeNav items={home_nav_items} />
    </div>
  );
}
