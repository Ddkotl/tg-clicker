"use client";

import { generated_fight_limit } from "@/config/energy_lvl";
import { getUserProfileByTgIdType } from "@/repositories/user_repository";
import { useQuery } from "@tanstack/react-query";
import { User, Gem, Clock, Backpack, HeartPulse, Droplet, Coins, Swords } from "lucide-react";
import Link from "next/link";

export function HeaderStats() {
  const { data, isLoading } = useQuery<{ profile: getUserProfileByTgIdType }>({
    queryKey: ["getUserProfileByTgId"],
    queryFn: async () => {
      const res = await fetch("api/user/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });
  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className="flex justify-center w-full">
      <div className="fixed top-0 z-50 bg-background/90 border-b border-foreground/60 w-full max-w-md">
        <div className="flex flex-wrap gap-3  items-center  p-2">
          <Link href="game/profile" className="flex items-center gap-1 font-semibold">
            <User className="h-4 w-4 text-muted-foreground" />
            {`${data?.profile?.profile?.nikname ? data?.profile?.profile?.nikname : "безымянный"}[${data?.profile?.profile?.lvl}]`}
          </Link>
          <div className="flex items-center gap-1">
            <Backpack className="h-4 w-4 text-red-500" />
          </div>

          <div className="flex items-center gap-1">
            <HeartPulse className="h-4 w-4 text-red-400" /> 61 208
          </div>
          <div className="flex items-center gap-1">
            <Droplet className="h-4 w-4 text-blue-400" /> {data?.profile?.profile?.mana}
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-yellow-400" />
            {data?.profile?.profile?.gold}
          </div>
          <div className="flex items-center gap-1">
            <Gem className="h-4 w-4 text-purple-500" />
            {data?.profile?.profile?.diamond}
          </div>
          <div className="flex items-center gap-1">
            <Swords className="h-4 w-4 text-shadow-gray-900" />
            {`${data?.profile?.profile?.fight}/${generated_fight_limit}`}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />{" "}
            {data?.profile?.profile?.last_fight_time?.toISOString() ?? "00.00"}
          </div>
        </div>
      </div>
    </div>
  );
}
