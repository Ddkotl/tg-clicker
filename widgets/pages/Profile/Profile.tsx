"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/features/translations/use_translation";
import { getProfileQuery } from "@/entities/profile/_queries/profile_query";
import { ProfileResponse } from "@/entities/profile";
import { lvl_exp } from "@/shared/game_config/lvl_exp";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ProfileHeader } from "./_ui/profile_header";
import { ProfileStat } from "./_ui/profile_stat";
import { ProfileNav } from "./_ui/profile_nav";
import { useGetSessionQuery } from "@/entities/auth";

export function Profile() {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const { data: session, isLoading: isoadingSession } = useGetSessionQuery();
  const { data: profile, isLoading } = useQuery<ProfileResponse>({
    ...getProfileQuery(userId),
  });

  const user = profile?.data;
  const exp = user?.exp ?? 0;
  const lvl = user?.lvl ?? 1;
  const progress = Math.min((exp / (lvl_exp[lvl] ?? 1)) * 100, 100);
  const nextExp = lvl_exp[lvl + 1] ?? lvl_exp[lvl];
  const isMyProfile = session?.data?.user.userId === userId;

  if (isLoading || isoadingSession) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-32 h-32 rounded-xl" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  if (!user) {
    return <div>{t("profile.not_found")}</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        avatarUrl={user.avatar_url ?? undefined}
        nickname={user.nikname ?? undefined}
        playerMotto={user.player_motto}
        fraktion={user.fraktion}
      />
      <ProfileStat
        label={t("lvl")}
        value={lvl.toString()}
        progress={progress}
        extra={`${exp} / ${nextExp}`}
      />
      <ProfileNav
        isMyProfile={isMyProfile}
        userId={user.userId}
        isLoading={isLoading}
      />
    </div>
  );
}
