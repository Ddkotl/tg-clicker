"use client";

import Image from "next/image";
import { Card, CardContent } from "@/shared/components/ui/card";
import { img_paths } from "@/shared/lib/img_paths";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { ui_path } from "@/shared/lib/paths";
import { RankingCardProps } from "../_domain/types";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function RankingCard({ rank, img, nickname, valueLabel, value, userId, isFetching }: RankingCardProps) {
  return (
    <Link
      href={ui_path.profile_page(userId)}
      className={cn("block w-full", isFetching && "opacity-70 pointer-events-none")}
    >
      <Card className="p-0 w-full border-none py-2 pt-4  bg-inherit backdrop-blur shadow-2xl hover:bg-primary/10 transition">
        <CardContent className="p-0 flex flex-col items-center  gap-1">
          <div className="relative w-20 h-20">
            <Image
              src={img ?? img_paths.fractions.adept_m()}
              alt="avatar"
              fill
              className="rounded-full object-cover border border-white/20 shadow"
            />
            <div className="absolute top-0 left-0 text-xs bg-primary/50 px-2 py-0.5 rounded-full">{rank}</div>
          </div>

          {/* Nickname */}
          <span className="text-xs font-medium text-center truncate max-w-[90%]">{nickname ?? "Unknown"}</span>

          {/* Value */}
          <div className="text-xs text-center font-semibold  px-3 py-1 rounded-lg w-full">
            {valueLabel}: <span className="font-bold  text-white">{value}</span>
          </div>
        </CardContent>
      </Card>{" "}
    </Link>
  );
}

export function RankingCardSkeleton() {
  return (
    <Card className="p-0 w-full border-none py-2 pt-4 bg-inherit backdrop-blur shadow-2xl">
      <CardContent className="p-0 flex flex-col items-center gap-1 animate-pulse">
        {/* Avatar + rank badge */}
        <div className="relative w-20 h-20">
          {/* Avatar circle */}
          <Skeleton className="w-full h-full rounded-full" />

          {/* Rank badge */}
          <Skeleton className="absolute top-0 left-0 w-8 h-4 rounded-full" />
        </div>

        {/* Nickname */}
        <Skeleton className="h-4 w-24 mt-1 rounded-md" />

        {/* Value */}
        <Skeleton className="h-5 w-28 rounded-md" />
      </CardContent>
    </Card>
  );
}
