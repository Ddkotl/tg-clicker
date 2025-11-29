"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";
import { queries_keys } from "@/shared/lib/queries_keys";
import { ProfileResponse, useProfileQuery } from "@/entities/profile";

export function useProfileHPUpdate(userId?: string) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: profileQuery } = useProfileQuery(userId || "");

  const clearTimeoutSafe = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!profileQuery || !profileQuery.data) {
      clearTimeoutSafe();
      return;
    }

    const ensureTickScheduled = () => {
      const tick = () => {
        try {
          const cached = queryClient.getQueryData<ProfileResponse>(queries_keys.profile_userId(userId));
          const profile = cached?.data;

          if (!profile) {
            return;
          }

          const { current_hitpoint, max_hitpoint, last_hp_update } = profile;
          if (!last_hp_update) {
            return;
          }

          const lastMs = new Date(last_hp_update).getTime();
          const now = Date.now();
          const intervalsPassed = Math.floor((now - lastMs) / HP_REGEN_INTERVAL);

          let newHP = current_hitpoint;
          let updatedLastMs = lastMs;

          if (intervalsPassed > 0) {
            const regenAmount = Math.floor(max_hitpoint * HP_REGEN_PERCENT * intervalsPassed);
            newHP = Math.min(current_hitpoint + regenAmount, max_hitpoint);
            updatedLastMs = lastMs + intervalsPassed * HP_REGEN_INTERVAL;

            queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(userId), (old) => {
              if (!old || !old.data) return old;
              return {
                ...old,
                data: {
                  ...old.data,
                  current_hitpoint: newHP,
                  last_hp_update: new Date(updatedLastMs),
                },
              };
            });
          } else {
            console.log("[useProfileHPUpdate.tick] nothing to update now");
          }

          const now2 = Date.now();
          const timeUntilNext = HP_REGEN_INTERVAL - ((now2 - updatedLastMs) % HP_REGEN_INTERVAL);

          clearTimeoutSafe();
          timeoutRef.current = setTimeout(tick, timeUntilNext);
        } catch (err) {
          console.error("[useProfileHPUpdate.tick] error:", err);
        }
      };

      const profile = profileQuery.data;
      if (!profile) {
        return;
      }
      const last = profile.last_hp_update ? new Date(profile.last_hp_update).getTime() : null;
      if (!last) {
        return;
      }

      const now = Date.now();
      const intervalsPassedNow = Math.floor((now - last) / HP_REGEN_INTERVAL);
      if (intervalsPassedNow > 0) {
        setTimeout(tick, 0);
      } else {
        const initialDelay = HP_REGEN_INTERVAL - ((now - last) % HP_REGEN_INTERVAL);
        clearTimeoutSafe();
        timeoutRef.current = setTimeout(tick, initialDelay);
      }
    };
    ensureTickScheduled();

    return () => {
      clearTimeoutSafe();
      console.log("[useProfileHPUpdate] cleanup for userId:", userId);
    };
  }, [userId, profileQuery, queryClient, clearTimeoutSafe]);
}
