"use client";
import { Fraktion } from "@/_generated/prisma";
import { useTranslation } from "@/features/translations/use_translation";
import { Separator } from "@/shared/components/ui/separator";

interface ProfileHeaderProps {
  profile_avatar: React.ReactNode;
  title: React.ReactNode;
  online: React.ReactNode;
  playerMotto?: string | null;
  fraktion?: Fraktion | null;
}

export function ProfileHeader({ profile_avatar, title, playerMotto, fraktion, online }: ProfileHeaderProps) {
  const { t } = useTranslation();

  const motto =
    playerMotto || (fraktion === Fraktion.ADEPT ? t("profile.no_motto_adept") : t("profile.no_motto_novice"));

  return (
    <div className="flex items-start gap-2 w-full">
      {profile_avatar}
      <div className="flex flex-col gap-2 w-full">
        {title}
        <Separator />
        <p className="text-sm text-muted-foreground">{motto}</p>
        {online}
      </div>
    </div>
  );
}
