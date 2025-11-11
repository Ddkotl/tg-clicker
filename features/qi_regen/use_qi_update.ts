"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queries_keys } from "@/shared/lib/queries_keys";
import { ProfileResponse } from "@/entities/profile";
import { getQiRegenPerInterval, QI_REGEN_INTERVAL } from "@/shared/game_config/params/qi_regen";
import { GetUserQiSkillsResponseType } from "@/entities/qi_skiils";

/**
 * Сколько миллисекунд до начала следующей "минуты" по часу
 */
function getMsUntilNextMinute() {
  const now = new Date();
  return 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
}

export function useQiRegen(userId?: string) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const tick = () => {
      const cached_profile = queryClient.getQueryData<ProfileResponse>(queries_keys.profile_userId(userId));
      const cached_qi_skills = queryClient.getQueryData<GetUserQiSkillsResponseType>(
        queries_keys.qi_skills_userId(userId),
      );
      const profile = cached_profile?.data;
      const skills = cached_qi_skills?.data;

      if (!profile || !skills) return;

      // Округляем прошлое обновление до начала минуты
      const lastUpdate = new Date(profile.last_qi_update);
      lastUpdate.setSeconds(0, 0);

      // Текущее время на фронте, округленное до минуты
      const now = new Date();
      const currentTime = new Date(now);
      currentTime.setSeconds(0, 0);

      const diffMs = currentTime.getTime() - lastUpdate.getTime();
      const intervalsPassed = Math.floor(diffMs / QI_REGEN_INTERVAL);

      if (intervalsPassed <= 0) {
        timeoutRef.current = setTimeout(tick, getMsUntilNextMinute());
        return;
      }

      const gainPerInterval = getQiRegenPerInterval({
        qi_param: profile.qi_param,
        power: profile.power,
        protection: profile.protection,
        speed: profile.speed,
        skill: profile.skill,
        lvl: profile.lvl,
        circulation_of_life: skills.circulation_of_life,
        interval: QI_REGEN_INTERVAL,
      });

      const newQi = Math.floor(profile.qi + gainPerInterval * intervalsPassed);

      queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            qi: newQi,
            last_qi_update: currentTime,
          },
        };
      });

      // Планируем следующий тик через минуту
      timeoutRef.current = setTimeout(tick, getMsUntilNextMinute());
    };

    // Первый тик
    timeoutRef.current = setTimeout(tick, getMsUntilNextMinute());

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [userId, queryClient]);
}
