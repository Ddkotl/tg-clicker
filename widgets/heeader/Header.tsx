"use client";

import { useQuery } from "@tanstack/react-query";
import { useGetSessionQuery } from "@/entities/auth/_queries/session_queries";
import { HeaderItem } from "./_ui/header_item";
import { getProfileQuery, ProfileResponse } from "@/entities/profile";
import { generated_fight_limit } from "@/shared/game_config/fight/energy_lvl";
import { HeaderProgressBars } from "./_ui/header_progress";
import { icons } from "@/shared/lib/icons";

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
            icon={icons.user({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game/profile/${userId}`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.nikname}[${profile?.data?.lvl}]`}
          />
          <HeaderItem
            icon={icons.backpack({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
          <HeaderItem
            icon={icons.heart({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game/profile/training/${userId}`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.current_hitpoint}`}
          />
          <HeaderItem
            icon={icons.qi_energy({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.qi}
          />
          <HeaderItem
            icon={icons.stone({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.qi_stone}
          />
          <HeaderItem
            icon={icons.crystal({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.spirit_stone}
          />
          <HeaderItem
            icon={icons.fight({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.fight}/${generated_fight_limit}`}
          />
          <HeaderItem
            icon={icons.clock({ className: "h-4 w-4 xs:h-5 xs:w-5" })}
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
