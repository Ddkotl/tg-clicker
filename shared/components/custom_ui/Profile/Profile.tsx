"use client";
import { Fraktion } from "@/_generated/prisma";
import { Progress } from "@/components/ui/progress";
import { lvl_exp } from "@/config/lvl_exp";
import { useTranslation } from "@/features/translations/use_translation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProfileQuery } from "@/querys/profile_queries";
import {
  ProfileErrorResponse,
  ProfileResponse,
} from "@/app/api/user/profile/route";
import { MainButton } from "../main-button";
export function Profile() {
  const params = useParams<{ userId: string }>();
  const { t } = useTranslation();
  const { data: profile, isLoading: isLoadingProfile } = useQuery<
    ProfileResponse | ProfileErrorResponse
  >({
    ...getProfileQuery(params.userId),
  });
  if (isLoadingProfile) return <div>Loading...</div>;
  const isMyProfile = profile?.data?.userId === params.userId;
  return (
    <>
      {/* Хедер */}
      <div className="flex  space-x-4">
        <Image
          src={profile?.data?.avatar_url as string}
          alt="Аватар"
          width={120}
          height={120}
          className="w-30 h-30 rounded-xl shadow-md"
        />
        <div>
          <h1 className="text-xl font-bold">{profile?.data?.nikname}</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.data?.player_motto ||
            profile?.data?.fraktion === Fraktion.ADEPT
              ? t("profile.no_motto_adept")
              : t("profile.no_motto_novice")}
          </p>
        </div>
      </div>

      {/* Характеристики */}
      <div className="space-y-3">
        <ProfileStat
          label={t("lvl")}
          value={profile?.data?.lvl.toString() as string}
          progress={
            ((profile?.data?.exp as number) /
              lvl_exp[profile?.data?.lvl as number]) *
            100
          }
          extra={`${profile?.data?.exp} / ${lvl_exp[(profile?.data?.lvl as number) + 1]}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        {[
          ...(isMyProfile
            ? [
                {
                  label: t("profile.development"),
                  href: `/game/profile/training/${profile.data?.userId}`,
                },
                {
                  label: `${t("profile.equipment")}`,
                  href: "/game/profile/equipment",
                },
                {
                  label: `${t("profile.friends")}`,
                  href: "/game/profile/friends",
                },
              ]
            : []),
          {
            label: `${t("profile.statistics")}`,
            href: "/game/profile/statistics",
          },
          {
            label: `${t("profile.questionnaire")}`,
            href: "/game/profile/questionnaire",
          },

          ...(isMyProfile
            ? [
                {
                  label: `${t("profile.description")}`,
                  href: "/game/profile/description",
                },
                {
                  label: `${t("profile.avatars")}`,
                  href: "/game/profile/avatars",
                },
                {
                  label: `${t("profile.invite")}`,
                  href: "/game/profile/invite",
                },
              ]
            : []),
        ].map((item) => (
          <MainButton
            key={item.href}
            item={item}
            isLoading={isLoadingProfile}
          />
        ))}
      </div>
    </>
  );
}

function ProfileStat({
  label,
  value,
  progress,
  extra,
}: {
  label: string;
  value: string;
  progress: number;
  extra?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium">
        <span>
          {label} {value}
        </span>
        <span>
          {extra && <span className="text-muted-foreground">({extra})</span>}
        </span>
      </div>
      <Progress value={progress} className="h-2 mt-1" />
    </div>
  );
}
