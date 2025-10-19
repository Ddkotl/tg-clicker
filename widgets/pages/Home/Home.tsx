"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { useGetUsersCountInFractionsQuery } from "@/entities/statistics";
import { useTranslation } from "@/features/translations/use_translation";
import { WelcomeCard } from "./_ui/welcome_card";
import { HomeNav } from "./_ui/home_nav";

export default function Home() {
  const { t } = useTranslation();
  const { data: session } = useGetSessionQuery();

  const { data: profile, isLoading: isLoadingProfile } = useQuery<ProfileResponse>({
    ...getProfileQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });

  const { data: dataFractionCounts, isLoading: isLoadingFractionCounts } = useGetUsersCountInFractionsQuery();

  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      <WelcomeCard
        t={t}
        isLoadingProfile={isLoadingProfile}
        isLoadingFractionCounts={isLoadingFractionCounts}
        profile={profile}
        dataFractionCounts={dataFractionCounts}
      />
      <HomeNav t={t} />
    </div>
  );
}
