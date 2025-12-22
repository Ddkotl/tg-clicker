"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { useProfileQuery } from "@/entities/profile/_queries/use_profile_query";
import { ProfileHeader } from "./profile_header";
import { ProfileNav } from "./profile_nav";
import { useGetSessionQuery } from "@/entities/auth";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { DisplayPlayerOnline } from "@/entities/profile/_ui/DisplayPlayerOnline";
import { ProfileAvatar } from "@/entities/profile/_ui/ProfileAvatar";
import { Title } from "@/shared/components/custom_ui/title";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ProfileParamsList } from "./profile_params_list";
import { Profile } from "@/_generated/prisma/client";
import { ProfileStatisticsList } from "./profile_statistics_list";

export function PlayerProfile({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();
  const { data: profile, isLoading } = useProfileQuery(userId);

  const user: Profile | undefined | null = profile?.data;

  const isMyProfile = session?.data?.user.userId === userId;

  if (isLoading || isLoadingSession) {
    return <ComponentSpinner />;
  }

  if (!user || !user.last_online_at) {
    return <div>{t("profile.not_found")}</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <ProfileHeader
        profile_avatar={
          <ProfileAvatar avatarUrl={user.avatar_url || ""} nickname={user.nikname || ""} className="w-24 h-24" />
        }
        title={<Title text={user.nikname || ""} align="left" size="xl" />}
        online={<DisplayPlayerOnline text={true} date={user.last_online_at} t={t} />}
        playerMotto={user.player_motto}
        fraktion={user.fraktion}
      />

      <Separator />
      <Tabs defaultValue="params">
        <TabsList className="w-full grid grid-cols-2 h-auto gap-2 bg-inherit shadow-2xl">
          <TabsTrigger value="params">
            <Title text={t("params")} align="center" size="sm" />
          </TabsTrigger>
          <TabsTrigger value="statistics">
            {" "}
            <Title text={t("profile.statistics")} align="center" size="sm" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="params">
          <Title text={t("params")} align="center" size="md" />
          <ProfileParamsList isMyProfile={isMyProfile} user={user} t={t} />
        </TabsContent>
        <TabsContent value="statistics">
          <Title text={t("profile.statistics")} align="center" size="md" />
          <ProfileStatisticsList t={t} userId={user.userId} isMyProfile={isMyProfile} />
        </TabsContent>
      </Tabs>

      <ProfileNav isMyProfile={isMyProfile} userId={user.userId} isLoading={isLoading} />
    </div>
  );
}
