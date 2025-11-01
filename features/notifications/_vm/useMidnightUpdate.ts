import { useEffect } from "react";
import dayjs from "dayjs";
import { useCreateDailyMissionMutation } from "@/entities/missions/_mutations/create_daily_missions";

export function useMidnightUpdate(userId?: string) {
  const mutation = useCreateDailyMissionMutation();

  useEffect(() => {
    if (!userId) return;

    // Функция для вычисления времени до 00:00 следующего дня
    const getNextMidnight = () => {
      return dayjs().startOf("day").add(1, "day").valueOf();
    };

    // Расчитываем время до следующего полуночи
    const nextMidnight = getNextMidnight();

    // Время задержки (миллисекунды до 00:00)
    const delay = nextMidnight - dayjs().valueOf();

    // Устанавливаем таймер на время до 00:00
    const timeout = setTimeout(() => {
      mutation.mutate({ userId }); // Создаем новые миссии для пользователя

      // После выполнения таймера можно очистить timeout
      clearTimeout(timeout); // Хотя это не обязательно, так как таймер сработает только один раз
    }, delay);

    return () => clearTimeout(timeout); // Очистка таймера при размонтировании компонента
  }, [userId, mutation]);
}
