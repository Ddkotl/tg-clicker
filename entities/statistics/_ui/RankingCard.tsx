"use client";

import Image from "next/image";
import { Card, CardContent } from "@/shared/components/ui/card";
import { img_paths } from "@/shared/lib/img_paths";

type RankingCardProps = {
  rank: number;
  img?: string | null;
  nickname: string | null;
  valueLabel: string;
  value: number;
};

export function RankingCard({ rank, img, nickname, valueLabel, value }: RankingCardProps) {
  return (
    <Card className="p-1 w-full rounded-2xl bg-white/10 backdrop-blur shadow-lg border border-white/10 hover:bg-white/20 transition">
      <CardContent className="p-0 flex flex-col items-center  gap-2">
        {/* Rank badge */}

        {/* Avatar */}
        <div className="relative w-20 h-20">
          <Image
            src={img ?? img_paths.fractions.adept_m()}
            alt="avatar"
            fill
            className="rounded-full object-cover border border-white/20 shadow"
          />
          <div className="absolute top-0 right-0 text-xs bg-black/40 px-2 py-0.5 rounded-full">{rank}</div>
        </div>

        {/* Nickname */}
        <span className="text-sm font-medium text-center truncate max-w-[90%]">{nickname ?? "Unknown"}</span>

        {/* Value */}
        <div className="text-sm text-center font-semibold bg-black/30 px-3 py-1 rounded-lg w-full">
          {valueLabel}: <div className="font-bold text-white">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
