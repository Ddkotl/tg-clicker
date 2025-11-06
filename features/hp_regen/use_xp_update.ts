"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";
import { queries_keys } from "@/shared/lib/queries_keys"; // поправь импорт getProfileQuery, если он в другом месте
import { getProfileQuery, ProfileResponse } from "@/entities/profile";

/**
 * Хук регенерации HP — теперь использует useQuery для получения актуального профиля.
 * - хук сам ничего не возвращает, работает "в фоне"
 * - логи помогают отладить поведение
 */
export function useProfileHPUpdate(userId?: string) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Получаем профиль через useQuery — когда данные придут/обновятся, эффект сработает
  const { data: profileQuery } = useQuery<ProfileResponse>({
    ...getProfileQuery(userId ?? ""),
    enabled: !!userId,
  });

  // Универсальная функция очистки
  const clearTimeoutSafe = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log("[useProfileHPUpdate] cleared timeout");
    }
  }, []);

  // Основная логика: реактивно на обновление profileQuery
  useEffect(() => {
    if (!userId) {
      console.log("[useProfileHPUpdate] no userId, bailing out");
      return;
    }

    console.log("[useProfileHPUpdate] effect triggered, userId:", userId, "profileQuery:", profileQuery);

    // если нет профиля — просто очистим таймаут и ждём
    if (!profileQuery || !profileQuery.data) {
      clearTimeoutSafe();
      console.log("[useProfileHPUpdate] profile not found in query result, waiting...");
      return;
    }

    const ensureTickScheduled = () => {
      // tick функция берёт профиль из cache (чтобы иметь самое свежее состояние)
      const tick = () => {
        try {
          const cached = queryClient.getQueryData<ProfileResponse>(queries_keys.profile_userId(userId));
          const profile = cached?.data;
          console.log("[useProfileHPUpdate.tick] cached profile:", cached);

          if (!profile) {
            console.log("[useProfileHPUpdate.tick] no profile in cache -> nothing");
            return;
          }

          const { current_hitpoint, max_hitpoint, last_hp_update } = profile;
          if (!last_hp_update) {
            console.log("[useProfileHPUpdate.tick] no last_hp_update -> nothing");
            return;
          }

          const lastMs = new Date(last_hp_update).getTime();
          const now = Date.now();
          console.log(
            "[useProfileHPUpdate.tick] now:",
            new Date(now).toISOString(),
            "last:",
            new Date(lastMs).toISOString(),
          );

          const intervalsPassed = Math.floor((now - lastMs) / HP_REGEN_INTERVAL);
          console.log("[useProfileHPUpdate.tick] intervalsPassed:", intervalsPassed);

          let newHP = current_hitpoint;
          let updatedLastMs = lastMs;

          if (intervalsPassed > 0) {
            const regenAmount = Math.floor(max_hitpoint * HP_REGEN_PERCENT * intervalsPassed);
            console.log(
              "[useProfileHPUpdate.tick] regenAmount:",
              regenAmount,
              "max:",
              max_hitpoint,
              "percent:",
              HP_REGEN_PERCENT,
            );

            newHP = Math.min(current_hitpoint + regenAmount, max_hitpoint);
            updatedLastMs = lastMs + intervalsPassed * HP_REGEN_INTERVAL;

            console.log(
              "[useProfileHPUpdate.tick] updating cache: newHP:",
              newHP,
              "newLast:",
              new Date(updatedLastMs).toISOString(),
            );

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

          // расчитываем время до следующего тика, опираясь на обновлённый last
          const now2 = Date.now();
          const timeUntilNext = HP_REGEN_INTERVAL - ((now2 - updatedLastMs) % HP_REGEN_INTERVAL);
          console.log("[useProfileHPUpdate.tick] scheduling next tick in ms:", timeUntilNext);

          clearTimeoutSafe();
          timeoutRef.current = setTimeout(tick, timeUntilNext);
        } catch (err) {
          console.error("[useProfileHPUpdate.tick] error:", err);
        }
      }; // end tick

      // Решаем - запускать tick сразу (если накопилось) или ждать initialDelay
      const profile = profileQuery.data;
      if (!profile) {
        console.log("[useProfileHPUpdate] profile is null, nothing to schedule");
        return;
      }
      const last = profile.last_hp_update ? new Date(profile.last_hp_update).getTime() : null;
      if (!last) {
        console.log("[useProfileHPUpdate] profile has no last_hp_update, nothing to schedule");
        return;
      }

      const now = Date.now();
      const intervalsPassedNow = Math.floor((now - last) / HP_REGEN_INTERVAL);
      if (intervalsPassedNow > 0) {
        console.log("[useProfileHPUpdate] intervalsPassedNow > 0 - running tick immediately");
        // run in microtask to avoid reentrancy
        setTimeout(tick, 0);
      } else {
        const initialDelay = HP_REGEN_INTERVAL - ((now - last) % HP_REGEN_INTERVAL);
        console.log("[useProfileHPUpdate] scheduling first tick in ms:", initialDelay);
        clearTimeoutSafe();
        timeoutRef.current = setTimeout(tick, initialDelay);
      }
    }; // end ensureTickScheduled

    // Когда useQuery вернул данные — ставим/пересоздаём таймер
    ensureTickScheduled();

    // cleanup при изменении dependency (новые данные или unmount)
    return () => {
      clearTimeoutSafe();
      console.log("[useProfileHPUpdate] cleanup for userId:", userId);
    };
  }, [userId, profileQuery, queryClient, clearTimeoutSafe]);
}
