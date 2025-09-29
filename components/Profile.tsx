// app/profile/page.tsx
"use client";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
export function Profile() {
  const profile = {
    nickname: "Викинг15",
    level: 22,
    exp: 13410,
    expMax: 13500,
    side: "Демоны",
    rank: "Неофит",
    squad: "Странное место",
    reputation: 3623,
    karma: 260,
    alliance: "Сборище",
    country: "Эритрея",
    achievements: { current: 39, total: 800 },
    avatar: "/adept_m.jpg",
    motto: "Мои тайны хранятся в глубинах бездны.",
  };

  return (
    <div className="max-w-md space-y-4">
      {/* Хедер */}
      <div className="flex items-center space-x-4">
        <Image
          src={profile.avatar}
          alt="Аватар"
          width={80}
          height={80}
          className="w-20 h-20 rounded-xl shadow-md"
        />
        <div>
          <h1 className="text-xl font-bold">{profile.nickname}</h1>
          <p className="text-sm text-muted-foreground">{profile.motto}</p>
        </div>
      </div>

      {/* Характеристики */}
      <div className="space-y-3">
        <ProfileStat
          label="Уровень"
          value={profile.level.toString()}
          progress={(profile.exp / profile.expMax) * 100}
          extra={`${profile.exp} / ${profile.expMax}`}
        />
        <ProfileStat
          label="Слава"
          value={profile.reputation.toString()}
          progress={(profile.reputation / 10000) * 100}
        />
        <ProfileStat
          label="Карма"
          value={profile.karma.toString()}
          progress={(profile.karma / 1000) * 100}
        />
        <ProfileStat
          label="Достижения"
          value={`${profile.achievements.current}/${profile.achievements.total}`}
          progress={
            (profile.achievements.current / profile.achievements.total) * 100
          }
        />
      </div>

      {/* Доп. инфо */}
      <div className="grid grid-cols-2 gap-3 text-sm">
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
      </div>
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
        <span>{label}</span>
        <span>
          {value}{" "}
          {extra && <span className="text-muted-foreground">({extra})</span>}
        </span>
      </div>
      <Progress value={progress} className="h-2 mt-1" />
    </div>
  );
}
