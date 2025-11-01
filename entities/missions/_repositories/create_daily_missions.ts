import { dataBase } from "@/shared/connect/db_connect";
import { generateDailyMissions } from "@/shared/game_config/missions/generate_daily_missions";
import { deleteOldMissions } from "./delete_old_missions";
import { hasTodayMissions } from "./check_daily_missions";

export async function createDailyMissions(userId: string) {
  try {
    // 1️⃣ Проверяем, есть ли миссии на сегодня

    const has_mission_today = await hasTodayMissions(userId);
    if (has_mission_today) {
      console.log(`⚠️Миссии уже были созданы сегодня для пользователя ${userId}`);
      return;
    }
    // 2️⃣ Удаляем вчерашние миссии
    await deleteOldMissions(userId);
    // 2️⃣ Загружаем данные пользователя
    const user = await dataBase.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          select: {
            lvl: true,
            power: true,
            qi_param: true,
            speed: true,
            protection: true,
            skill: true,
          },
        },
      },
    });

    if (!user?.profile) {
      console.warn(`⚠️ Профиль не найден для пользователя ${userId}`);
      return;
    }

    const { lvl, power, qi_param, speed, protection, skill } = user.profile;

    // 3️⃣ Генерируем миссии под параметры игрока
    const daily_missions = generateDailyMissions(lvl, power, qi_param, speed, protection, skill);

    // 4️⃣ Создаём миссии
    await dataBase.mission.createMany({
      data: daily_missions.map((m) => ({ ...m, userId })),
    });

    console.log(`✅ Новые миссии созданы для пользователя ${userId}`);
  } catch (error) {
    console.error("❌ createDailyMissions error:", error);
  }
}
