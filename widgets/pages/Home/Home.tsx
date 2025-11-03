"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { useGetUsersCountInFractionsQuery } from "@/entities/statistics";
import { useTranslation } from "@/features/translations/use_translation";
import { WelcomeCard } from "./_ui/welcome_card";
import { NavItem, PageNav } from "@/shared/components/custom_ui/page_nav";
import { icons } from "@/shared/lib/icons";

export default function Home() {
  const { t } = useTranslation();
  const { data: session } = useGetSessionQuery();

  const { data: profile, isLoading: isLoadingProfile } = useQuery<ProfileResponse>({
    ...getProfileQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });

  const { data: dataFractionCounts, isLoading: isLoadingFractionCounts } = useGetUsersCountInFractionsQuery();
  const home_nav_items: NavItem[] = [
    {
      label: `${t("home.navigation.chronicles")}`,
      href: "/game/facts",
      icon: icons.fact({}),
    },
    {
      label: `${t("home.navigation.battle")}`,
      href: "/game/battle",
      icon: icons.fight({}),
    },
    {
      label: `${t("home.navigation.headquarters")}`,
      href: "/game/headquarter",
      icon: icons.temple({}),
    },
    {
      label: `${t("home.navigation.city")}`,
      href: "/game/city",
      icon: icons.citadel({}),
    },
    {
      label: `${t("home.navigation.agent")}`,
      href: "/game/agent",
      icon: icons.pet({}),
    },
    {
      label: `${t("home.navigation.rating")}`,
      href: "/game/ranking",
      icon: icons.trophy({ className: "h-10 w-10 " }),
    },
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
      <PageNav nav_items={home_nav_items} className="grid grid-cols-2 gap-2" />
    </div>
  );
}
