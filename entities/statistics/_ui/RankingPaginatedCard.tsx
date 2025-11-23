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

export function RankingPaginatedCard({ rank, img, nickname, valueLabel, value }: RankingCardProps) {
  return (
    <Card className="p-1 w-full rounded-2xl bg-white/10 backdrop-blur shadow-lg border border-white/10 hover:bg-white/20 transition">
      <CardContent className="p-0 flex  items-center  gap-2">
        {/* Rank badge */}

        {/* Avatar */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={img ?? img_paths.fractions.adept_m()}
            alt="avatar"
            fill
            className="rounded-full object-cover border border-white/20 shadow"
          />
          <div className="absolute top-0 right-0 text-xs bg-black/40 px-2 py-0.5 rounded-full">{rank}</div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          {/* Nickname */}
          <span className="text-sm font-medium  text-start p-1 truncate max-w-[90%]">{nickname ?? "Unknown"}</span>

          {/* Value */}
          <div className="text-sm  font-semibold bg-black/30 text-start p-1 rounded-lg w-full">
            {valueLabel}: <span className="font-bold text-white">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
