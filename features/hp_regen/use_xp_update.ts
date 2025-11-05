"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useProfileHPUpdate(userId?: string) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!userId) return;

    const tick = () => {
      const profile = queryClient.getQueryData<{ data: any }>(
        queries_keys.profile_userId(userId)
      )?.data;

      if (!profile) return;

      const { current_hitpoint, max_hitpoint, last_hp_update } = profile;
      if (!last_hp_update) return;

      const last = new Date(last_hp_update).getTime();
      const now = Date.now();

      // Рассчитываем, сколько интервалов прошло
      const intervalsPassed = Math.floor((now - last) / HP_REGEN_INTERVAL);

      let newHP = current_hitpoint;
      let newLastUpdate = new Date(last);

      if (intervalsPassed > 0) {
        const regenAmount = Math.floor(max_hitpoint * HP_REGEN_PERCENT * intervalsPassed);
        newHP = Math.min(current_hitpoint + regenAmount, max_hitpoint);
        newLastUpdate = new Date(last + intervalsPassed * HP_REGEN_INTERVAL);

        queryClient.setQueryData(queries_keys.profile_userId(userId), (old: any) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  current_hitpoint: newHP,
                  last_hp_update: newLastUpdate,
                },
              }
            : old
        );
      }

      // Время до следующего обновления
      const timeUntilNext = HP_REGEN_INTERVAL - ((now - newLastUpdate.getTime()) % HP_REGEN_INTERVAL);

      timeoutRef.current = setTimeout(tick, timeUntilNext);
      console.log("Next HP update in:", timeUntilNext, "ms");
    };

    // Первый тик сразу с точным временем до следующего интервала
    const profile = queryClient.getQueryData<{ data: any }>(
      queries_keys.profile_userId(userId)
    )?.data;

    if (profile?.last_hp_update) {
      const last = new Date(profile.last_hp_update).getTime();
      const now = Date.now();
      const initialDelay = HP_REGEN_INTERVAL - ((now - last) % HP_REGEN_INTERVAL);
      timeoutRef.current = setTimeout(tick, initialDelay);
      console.log("First HP update scheduled in:", initialDelay, "ms");
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      console.log("HP update hook unmounted, timeout cleared.");
    };
  }, [queryClient, userId]);
}
