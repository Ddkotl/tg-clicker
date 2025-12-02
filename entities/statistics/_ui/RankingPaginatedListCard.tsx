"use client";

import Image from "next/image";
import { Card, CardContent } from "@/shared/components/ui/card";
import { img_paths } from "@/shared/lib/img_paths";
import Link from "next/link";
import { ui_path } from "@/shared/lib/paths";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { RankingCardProps } from "../_domain/types";

export function RankingPaginatedListCard({
  userId,
  rank,
  img,
  nickname,
  valueLabel,
  value,
  isFetching,
}: RankingCardProps) {
  return (
    <Link
      href={ui_path.profile_page(userId)}
      className={cn("block w-full", isFetching && "opacity-70 pointer-events-none")}
    >
      <Card
        className="
        p-0 w-full rounded-full bg-inherit backdrop-blur 
        shadow-md border border-white/10 
        hover:bg-primary/10 shadow-2xl 
        transition-colors 
      "
      >
        <CardContent className="p-0 flex items-center gap-3">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={img ?? img_paths.fractions.adept_m()}
              alt="avatar"
              fill
              className="rounded-full object-cover border border-white/20 shadow"
            />

            <div
              className="
              absolute top-0 left-0 text-xs px-2 py-0.5 rounded-full 
              bg-primary/50 backdrop-blur-lg 
              border border-white/20 
              transition-colors
              group-hover:bg-primary/60
            "
            >
              {rank}
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <span className="text-sm font-medium text-start px-1 truncate">{nickname ?? "Unknown"}</span>

            <div className="text-sm font-semibold text-start px-1">
              {valueLabel}: <span className="font-bold text-white">{value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function RankingPaginatedListCardSkeleton() {
  return (
    <Card
      className="
      p-0 w-full rounded-full bg-white/5 backdrop-blur 
      shadow-md border border-white/10 
      transition-colors
    "
    >
      <div className="p-0 flex items-center gap-3">
        {/* Аватар + бейдж ранга */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <Skeleton className="w-full h-full rounded-full bg-white/10" />

          <Skeleton
            className="
              absolute top-0 left-0 
              h-4 w-8 
              rounded-full bg-white/10
            "
          />
        </div>

        {/* Ник + значение */}
        <div className="flex flex-col gap-1 w-full pr-2">
          <Skeleton className="h-5 w-1/2 bg-white/10 rounded-md" />
          <Skeleton className="h-5 w-1/3 bg-white/10 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
