"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetSessionQuery } from "@/entities/auth";
import { getProfileQuery, ProfileResponse, ProfileErrorResponse } from "@/entities/profile";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useProfileHPUpdate() {
  const queryClient = useQueryClient();
  const { data: session } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const { data: profile } = useQuery<ProfileResponse, ProfileErrorResponse>({
    ...getProfileQuery(userId ?? ""),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!profile?.data || !userId) return;

    const tick = () => {
      if (!profile?.data || !userId) return;
      const { current_hitpoint, max_hitpoint, last_hp_update } = profile.data;
      if (!last_hp_update) return;

      const lastUpdate = new Date(last_hp_update).getTime();
      const now = Date.now();
      const intervalsPassed = Math.floor((now - lastUpdate) / HP_REGEN_INTERVAL);

      if (intervalsPassed <= 0) return;

      const regenAmount = Math.floor(max_hitpoint * HP_REGEN_PERCENT * intervalsPassed);
      const newHP = Math.min(max_hitpoint, current_hitpoint + regenAmount);
      const newLastUpdate = new Date(lastUpdate + intervalsPassed * HP_REGEN_INTERVAL);

      queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(userId), (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data!,
                current_hitpoint: newHP,
                last_hp_update: newLastUpdate,
              },
            }
          : old,
      );
    };

    const interval = setInterval(tick, 60 * 1000);
    tick();
    return () => clearInterval(interval);
  }, [profile?.data, queryClient, userId]);
}
