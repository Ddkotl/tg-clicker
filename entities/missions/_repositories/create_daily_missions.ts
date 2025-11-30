import { generateDailyMissions } from "@/shared/game_config/missions/generate_daily_missions";
import { missionRepository } from "./mission_repository";
import { profileRepository } from "@/entities/profile/index.server";

export async function createDailyMissions(userId: string) {
  try {
    const has_mission_today = await missionRepository.hasTodayMissions({ userId: userId });
    if (has_mission_today) {
      return;
    }
    await missionRepository.deleteOldMissions({ userId: userId });

    const profile = await profileRepository.getByUserId({ userId: userId });

    if (!profile) {
      console.warn(`⚠️ Профиль не найден для пользователя ${userId}`);
      return;
    }

    const { lvl, power, qi_param, speed, protection, skill } = profile;

    const daily_missions = generateDailyMissions(lvl, power, qi_param, speed, protection, skill);

    const created_missions = await missionRepository.createMissions({
      daily_missions: daily_missions,
      userId: userId,
    });
    if (!created_missions) {
      console.error(`❌ Ошибка при создании миссий для пользователя ${userId}`);
      return;
    }
    console.log(`✅ Новые миссии созданы для пользователя ${userId}`);
  } catch (error) {
    console.error("❌ createDailyMissions error:", error);
  }
}
