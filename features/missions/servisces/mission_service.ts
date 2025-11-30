import { missionRepository } from "@/entities/missions/index.server";
import { profileRepository } from "@/entities/profile/index.server";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { generateDailyMissions } from "@/shared/game_config/missions/generate_daily_missions";

export class MissionService {
  constructor(
    private profileRepo = profileRepository,
    private missionRepo = missionRepository,
  ) {}

  async createDailyMissions({ userId, tx }: { userId: string; tx?: TransactionType }) {
    if (tx) {
      return this._runCreate({ userId, tx });
    }

    return await dataBase.$transaction(async (trx) => {
      return this._runCreate({ userId, tx: trx });
    });
  }

  private async _runCreate({ userId, tx }: { userId: string; tx: TransactionType }) {
    const has_mission_today = await this.missionRepo.hasTodayMissions({ userId, tx });
    if (has_mission_today) return;

    await this.missionRepo.deleteOldMissions({ userId, tx });

    const profile = await this.profileRepo.getByUserId({ userId, tx });
    if (!profile) {
      console.warn(`⚠️ Профиль не найден для пользователя ${userId}`);
      return;
    }

    const { lvl, power, qi_param, speed, protection, skill } = profile;
    const daily_missions = generateDailyMissions(lvl, power, qi_param, speed, protection, skill);

    const created_missions = await this.missionRepo.createMissions({
      daily_missions,
      userId,
      tx,
    });

    if (!created_missions) {
      console.error(`❌ Ошибка при создании миссий для пользователя ${userId}`);
      return;
    }

    return created_missions;
  }
}

export const missionService = new MissionService();
