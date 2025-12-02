"use client";
import { Fraktion } from "@/_generated/prisma";
import { useTranslation } from "@/features/translations/use_translation";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import { getProfileLetters } from "./get_profile_letters";
import { DisplayPlayerOnline } from "./DisplayPlayerOnline";

interface ProfileHeaderProps {
  avatarUrl?: string;
  nickname?: string;
  playerMotto?: string | null;
  fraktion?: Fraktion | null;
}

export function ProfileHeader({ avatarUrl, nickname, playerMotto, fraktion }: ProfileHeaderProps) {
  const { t } = useTranslation();

  const motto =
    playerMotto || (fraktion === Fraktion.ADEPT ? t("profile.no_motto_adept") : t("profile.no_motto_novice"));

  return (
    <div className="flex items-start space-x-4">
      <Avatar className="w-28 h-28">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{getProfileLetters(nickname || "")}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{nickname}</h1>
        <Separator />
        <p className="text-sm text-muted-foreground">{motto}</p>
        <DisplayPlayerOnline />
      </div>
    </div>
  );
}
