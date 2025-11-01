"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileQuery, ProfileResponse, ProfileErrorResponse } from "@/entities/profile";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useProfileHPUpdate(userId?: string) {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery<ProfileResponse, ProfileErrorResponse>({
    ...getProfileQuery(userId ?? ""),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!profile?.data || !userId) return;

    const { current_hitpoint, max_hitpoint, last_hp_update } = profile.data;
    if (!last_hp_update) return;

    // Функция для выполнения обновления
    const updateHP = () => {
      const lastUpdate = new Date(last_hp_update).getTime();
      const now = Date.now();

      // Логи для дебага
      console.log("Last update time:", lastUpdate);
      console.log("Current time:", now);

      // Рассчитываем оставшееся время до следующего обновления
      const timeUntilNextUpdate = HP_REGEN_INTERVAL - ((now - lastUpdate) % HP_REGEN_INTERVAL);
      console.log("Time until next update (ms):", timeUntilNextUpdate);

      // Логируем процент регенерации
      console.log("HP_REGEN_PERCENT:", HP_REGEN_PERCENT);
      console.log("max_hitpoint:", max_hitpoint);
      const regenAmount = Math.floor(max_hitpoint * HP_REGEN_PERCENT);
      console.log("HP Regen Amount:", regenAmount);

      // Если regenAmount равен 0, это проблема с HP_REGEN_PERCENT
      if (regenAmount === 0) {
        console.warn("HP Regen Amount is 0! Check your HP_REGEN_PERCENT.");
      }

      const newHP = Math.min(max_hitpoint, current_hitpoint + regenAmount);
      const newLastUpdate = new Date(now + timeUntilNextUpdate);

      // Логируем обновление данных
      console.log("New HP:", newHP);
      console.log("New Last Update Time:", newLastUpdate);

      // Обновляем данные в queryClient
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

      // Устанавливаем новый таймер для следующего обновления
      const timeout = setTimeout(updateHP, timeUntilNextUpdate);
      console.log("Next update scheduled in:", timeUntilNextUpdate, "ms");
      return timeout;
    };

    // Устанавливаем первый таймер с точным временем до следующего обновления
    const initialTimeout = setTimeout(updateHP, HP_REGEN_INTERVAL);
    console.log("First timeout scheduled in:", HP_REGEN_INTERVAL, "ms");

    return () => {
      clearTimeout(initialTimeout); // Очистим таймер при размонтировании компонента
      console.log("Component unmounted, timeout cleared.");
    };
  }, [profile?.data, queryClient, userId]);
}
