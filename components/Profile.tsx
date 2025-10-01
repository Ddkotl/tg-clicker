"use client";
import { Fraktion } from "@/_generated/prisma";
import { Progress } from "@/components/ui/progress";
import { lvl_exp } from "@/config/lvl_exp";
import { useTranslation } from "@/hooks/use_translation";
import { getUserProfileByTgIdType } from "@/repositories/user_repository";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
export function Profile() {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useQuery<getUserProfileByTgIdType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Не удалось загрузить пользователя");
      return res.json();
    },
  });
  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="max-w-md space-y-4">
      {/* Хедер */}
      <div className="flex  space-x-4">
        <Image
          src={profile?.profile?.avatar_url as string}
          alt="Аватар"
          width={120}
          height={120}
          className="w-30 h-30 rounded-xl shadow-md"
        />
        <div>
          <h1 className="text-xl font-bold">{profile?.profile?.nikname}</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.profile?.player_motto ||
            profile?.profile?.fraktion === Fraktion.ADEPT
              ? t("profile.no_motto_adept")
              : t("profile.no_motto_novice")}
          </p>
        </div>
      </div>

      {/* Характеристики */}
      <div className="space-y-3">
        <ProfileStat
          label={t("profile.lvl")}
          value={profile?.profile?.lvl.toString() as string}
          progress={
            ((profile?.profile?.exp as number) /
              lvl_exp[profile?.profile?.lvl as number]) *
            100
          }
          extra={`${profile?.profile?.exp} / ${lvl_exp[(profile?.profile?.lvl as number) + 1]}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        {[
          { label: `${t("profile.development")}`, href: "/profile/training" },
          { label: `${t("profile.equipment")}`, href: "/profile/equipment" },
          { label: `${t("profile.friends")}`, href: "/profile/friends" },
          {
            label: `${t("profile.questionnaire")}`,
            href: "/profile/questionnaire",
          },
          {
            label: `${t("profile.description")}`,
            href: "/profile/description",
          },
          { label: `${t("profile.avatars")}`, href: "/profile/avatars" },
          { label: `${t("profile.invite")}`, href: "/profile/invite" },
        ].map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button asChild className="w-full bg-primary/70" size="lg">
              <span>{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
      {/* Доп. инфо */}
      {/* <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Сторона:</span> {profile.side}
        </div>
        <div>
          <span className="text-muted-foreground">Звание:</span> {profile.rank}
        </div>
        <div>
          <span className="text-muted-foreground">Отряд:</span> {profile.squad}
        </div>
        <div>
          <span className="text-muted-foreground">Альянс:</span>{" "}
          {profile.alliance}
        </div>
        <div>
          <span className="text-muted-foreground">Страна:</span>{" "}
          {profile.country}
        </div>
      </div> */}
    </div>
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
