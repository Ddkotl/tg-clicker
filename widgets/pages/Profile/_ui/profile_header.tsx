"use client";
import Image from "next/image";
import { Fraktion } from "@/_generated/prisma";
import { useTranslation } from "@/features/translations/use_translation";

interface ProfileHeaderProps {
  avatarUrl?: string;
  nickname?: string;
  playerMotto?: string | null;
  fraktion?: Fraktion | null;
}

export function ProfileHeader({
  avatarUrl,
  nickname,
  playerMotto,
  fraktion,
}: ProfileHeaderProps) {
  const { t } = useTranslation();

  const motto =
    playerMotto ||
    (fraktion === Fraktion.ADEPT
      ? t("profile.no_motto_adept")
      : t("profile.no_motto_novice"));

  return (
    <div className="flex items-center space-x-4">
      <Image
        src={avatarUrl || "/default-avatar.png"}
        alt={t("profile.avatar_alt")}
        width={120}
        height={120}
        className="w-28 h-28 rounded-xl shadow-md object-cover"
      />
      <div>
        <h1 className="text-xl font-bold">{nickname}</h1>
        <p className="text-sm text-muted-foreground">{motto}</p>
      </div>
    </div>
  );
}
