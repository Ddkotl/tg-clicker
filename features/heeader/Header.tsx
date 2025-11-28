"use client";

import { useGetSessionQuery } from "@/entities/auth/_queries/session_queries";
import { HeaderItem } from "./_ui/header_item";
import { useProfileQuery } from "@/entities/profile";
import { HeaderProgressBars } from "./_ui/header_progress";
import { icons } from "@/shared/lib/icons";
import { FIGHT_CHARGE_REGEN_INTERVAL, FIGHT_MAX_CHARGES } from "@/shared/game_config/fight/fight_const";
import { getPastedIntervals } from "@/shared/game_config/getPastedIntervals";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { useQueryClient } from "@tanstack/react-query";
import { queries_keys } from "@/shared/lib/queries_keys";

export function Header() {
  const queryClient = useQueryClient();
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();
  const userId = session?.data?.user.userId;
  const { data: profile, isLoading: isLoadingProfile, isFetching: isFetchingProfile } = useProfileQuery(userId || "");
  const isLoading = isLoadingProfile || isLoadingSession;
  const isDisabled = isFetchingProfile;

  const { past_intervals, new_last_action_date } = getPastedIntervals({
    now_ms: Date.now(),
    last_action_ms: profile?.data?.last_charge_recovery
      ? new Date(profile.data.last_charge_recovery).getTime()
      : new Date().getTime(),
    interval_ms: FIGHT_CHARGE_REGEN_INTERVAL,
  });

  const isChargesMax = profile?.data?.fight_charges === FIGHT_MAX_CHARGES;

  return (
    <div className="flex justify-center w-full">
      <div className="fixed top-0 z-50 bg-header-gradient  w-full max-w-md">
        <div className="flex flex-wrap gap-2 justify-evenly w-full  items-center  p-2">
          <HeaderItem
            icon={icons.user({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game/profile/${userId}`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.nikname}[${profile?.data?.lvl}]`}
          />
          <HeaderItem
            icon={icons.backpack({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
          <HeaderItem
            icon={icons.heart({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game/profile/training/${userId}`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${profile?.data?.current_hitpoint}`}
          />
          <HeaderItem
            icon={icons.qi_energy({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.qi}
          />
          <HeaderItem
            icon={icons.stone({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.qi_stone}
          />
          <HeaderItem
            icon={icons.crystal({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={profile?.data?.spirit_cristal}
          />
          <HeaderItem
            icon={icons.fight({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            value={`${Math.min(Number(profile?.data?.fight_charges ?? 0) + past_intervals, FIGHT_MAX_CHARGES)}/${FIGHT_MAX_CHARGES}`}
          />
          <HeaderItem
            icon={icons.clock({
              className: "h-4 w-4 xs:h-5 xs:w-5",
            })}
            href={`/game`}
            isDisabled={isDisabled}
            isLoading={isLoading}
            element={
              !isChargesMax && (
                <CountdownTimer
                  endTime={new_last_action_date.getTime() + FIGHT_CHARGE_REGEN_INTERVAL}
                  onComplete={() => {
                    queryClient.invalidateQueries({ queryKey: queries_keys.profile_userId(userId || "") });
                  }}
                />
              )
            }
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
