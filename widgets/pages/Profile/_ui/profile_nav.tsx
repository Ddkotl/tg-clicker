"use client";

import { useMemo } from "react";
import { useTranslation } from "@/features/translations/use_translation";
import { MainButton } from "@/shared/components/custom_ui/main-button";

interface ProfileButtonsProps {
  isMyProfile: boolean;
  userId: string;
  isLoading?: boolean;
}

export function ProfileNav({ isMyProfile, userId, isLoading }: ProfileButtonsProps) {
  const { t } = useTranslation();

  const buttons = useMemo(() => {
    const base = [
      { label: t("profile.statistics"), href: "/game/profile/statistics" },
      {
        label: t("profile.questionnaire"),
        href: "/game/profile/questionnaire",
      },
    ];

    if (!isMyProfile) return base;

    return [
      {
        label: t("profile.development"),
        href: `/game/profile/training/${userId}`,
      },
      { label: t("profile.equipment"), href: "/game/profile/equipment" },
      { label: t("profile.friends"), href: "/game/profile/friends" },
      ...base,
      { label: t("profile.description"), href: "/game/profile/description" },
      { label: t("profile.avatars"), href: "/game/profile/avatars" },
      { label: t("profile.invite"), href: "/game/profile/invite" },
    ];
  }, [t, isMyProfile, userId]);

  return (
    <div className="flex flex-col gap-2">
      {buttons.map((btn) => (
        <MainButton key={btn.href} label={btn.label} href={btn.href} isLoading={isLoading} />
      ))}
    </div>
  );
}
