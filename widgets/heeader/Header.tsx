"use client";

import { useQuery } from "@tanstack/react-query";
import { User, Gem, Clock, Backpack, HeartPulse, Droplet, Swords, Sparkles } from "lucide-react";
import { useGetSessionQuery } from "@/entities/auth/_queries/session_queries";
import { HeaderItem } from "./_ui/header_item";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { generated_fight_limit } from "@/shared/game_config/fight/energy_lvl";
import { HeaderProgressBars } from "./_ui/header_progress";

export function Header() {
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
  } = useQuery<ProfileResponse>({
    ...getProfileQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });
  const userId = profile?.data?.userId;
  const isLoading = isLoadingProfile || isLoadingSession;
  const isDisabled = isFetchingProfile;
  const formattedTime = profile?.data?.last_fight_time
    ? new Date(profile.data.last_fight_time).toLocaleTimeString()
    : "00:00";

  return (
    <div className="flex justify-center w-full">
      <div className="fixed top-0 z-50 bg-header-gradient  w-full max-w-md">
        <div className="flex flex-wrap gap-2 justify-evenly w-full  items-center  p-2">
          <HeaderItem
            icon={User}
            color="text-primary"
            href={`/game/profile/${userId}`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.nikname}[${profile?.data?.lvl}]`}
          />
          <HeaderItem
            icon={Backpack}
            color="text-green-700"
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
          <HeaderItem
            icon={HeartPulse}
            color="text-red-500"
            href={`/game/profile/training/${userId}`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.current_hitpoint}`}
          />
          <HeaderItem
            icon={Droplet}
            color="text-blue-500"
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.mana}
          />
          <HeaderItem
            icon={Sparkles}
            color="text-yellow-500"
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.gold}
          />
          <HeaderItem
            icon={Gem}
            color="text-purple-500"
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.diamond}
          />
          <HeaderItem
            icon={Swords}
            color="text-shadow-gray-900"
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.fight}/${generated_fight_limit}`}
          />
          <HeaderItem
            icon={Clock}
            color="text-gray-400"
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={formattedTime}
          />
        </div>
        <HeaderProgressBars
          currentHP={profile?.data?.current_hitpoint}
          maxHP={profile?.data?.max_hitpoint}
          currentExp={profile?.data?.exp}
          lvl={profile?.data?.lvl}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
