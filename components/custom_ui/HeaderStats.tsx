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
import { cn } from "@/lib/utils";
import { getProfileQuery } from "@/querys/profile_queries";
import { Skeleton } from "../ui/skeleton";
import { SessionErrorResponse, SessionResponse } from "@/app/api/session/route";
import { getSessionQuery } from "@/querys/session_queries";
import {
  ProfileErrorResponse,
  ProfileResponse,
} from "@/app/api/user/profile/route";

export function HeaderStats() {
  const { data: session } = useQuery<SessionResponse | SessionErrorResponse>({
    ...getSessionQuery(),
  });
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
  } = useQuery<ProfileResponse | ProfileErrorResponse>({
    ...getProfileQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });
  return (
    <div className="flex justify-center w-full">
      <div className="fixed top-0 z-50 bg-background/90 border-b border-foreground/60 w-full max-w-md">
        <div className="flex flex-wrap gap-3  items-center  p-2">
          {isLoadingProfile ? (
            <>
              <Skeleton className="h-4 w-10 rounded-md" />[
              <Skeleton className="h-4 w-6 rounded-md" />]
            </>
          ) : (
            <Link
              href={`/game/profile/${profile?.data?.userId}`}
              className={cn(
                "flex items-center gap-1 font-semibold",
                `${isFetchingProfile && "opacity-50 pointer-events-none"}`,
              )}
            >
              <User className="h-4 w-4 text-primary" />
              {`${profile?.data?.nikname}[${profile?.data?.lvl}]`}
            </Link>
          )}

          <div className="flex items-center gap-1">
            <Backpack className="h-4 w-4 text-red-500" />
          </div>

          <div className="flex items-center gap-1">
            <HeartPulse className="h-4 w-4 text-red-400" /> 61 208
          </div>
          <div className="flex items-center gap-1">
            <Droplet className="h-4 w-4 text-blue-400" /> {profile?.data?.mana}
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-yellow-400" />
            {profile?.data?.gold}
          </div>
          <div className="flex items-center gap-1">
            <Gem className="h-4 w-4 text-purple-500" />
            {profile?.data?.diamond}
          </div>
          <div className="flex items-center gap-1">
            <Swords className="h-4 w-4 text-shadow-gray-900" />
            {`${profile?.data?.fight}/${generated_fight_limit}`}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />{" "}
            {profile?.data?.last_fight_time?.toISOString() ?? "00.00"}
          </div>
        </div>
      </div>
    </div>
  );
}
