"use client";

import { generated_fight_limit } from "@/config/energy_lvl";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Gem,
  Clock,
  Backpack,
  HeartPulse,
  Droplet,
  Coins,
  Swords,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getUserProfileByUserIdType } from "@/repositories/user_repository";

export function HeaderStats() {
  const { data, isFetching } = useQuery<getUserProfileByUserIdType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("api/user/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });

  return (
    <div className="flex justify-center w-full">
      <div className="fixed top-0 z-50 bg-background/90 border-b border-foreground/60 w-full max-w-md">
        <div className="flex flex-wrap gap-3  items-center  p-2">
          {
            <Link
              href={`/game/profile/${data?.profile?.userId}`}
              className={cn(
                "flex items-center gap-1 font-semibold",
                `${isFetching && "opacity-50 pointer-events-none"}`,
              )}
            >
              <User className="h-4 w-4 text-primary" />
              {`${data?.profile?.nikname}[${data?.profile?.lvl}]`}
            </Link>
          }

          <div className="flex items-center gap-1">
            <Backpack className="h-4 w-4 text-red-500" />
          </div>

          <div className="flex items-center gap-1">
            <HeartPulse className="h-4 w-4 text-red-400" /> 61 208
          </div>
          <div className="flex items-center gap-1">
            <Droplet className="h-4 w-4 text-blue-400" /> {data?.profile?.mana}
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-yellow-400" />
            {data?.profile?.gold}
          </div>
          <div className="flex items-center gap-1">
            <Gem className="h-4 w-4 text-purple-500" />
            {data?.profile?.diamond}
          </div>
          <div className="flex items-center gap-1">
            <Swords className="h-4 w-4 text-shadow-gray-900" />
            {`${data?.profile?.fight}/${generated_fight_limit}`}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />{" "}
            {data?.profile?.last_fight_time?.toISOString() ?? "00.00"}
          </div>
        </div>
      </div>
    </div>
  );
}
