import { dataBase } from "@/shared/connect/db_connect";
import dayjs from "dayjs";

export async function goSpiritPath(userId: string, minutes: number, spirit_path_reward: number) {
  try {
    const spirit_path = await dataBase.spiritPath.findUnique({
      where: { userId },
    });

    // если уже идёт путь — не даём начать новый
    if (spirit_path?.on_spirit_paths) return null;

    // 🧭 Проверка дневного лимита
    const today = dayjs().startOf("day").toDate();
    const sameDay = spirit_path?.date_today ? dayjs(spirit_path.date_today).isSame(today, "day") : false;

    const minutesToday = sameDay ? (spirit_path?.minutes_today ?? 0) : 0;
    const totalMinutes = minutesToday + minutes;

    if (totalMinutes > 480) {
      console.warn(`User ${userId} exceeded daily spirit path limit: ${totalMinutes} minutes`);
      return null; // можно вернуть ошибку или спецтип
    }

    // ✅ если всё норм — начинаем новый путь
    return await dataBase.spiritPath.update({
      where: { userId },
      data: {
        spirit_paths_minutes: minutes,
        on_spirit_paths: true,
        start_spirit_paths: new Date(),
        spirit_paths_reward: spirit_path_reward,
      },
    });
  } catch (error) {
    console.error("goSpiritPath error", error);
    return null;
  }
}
