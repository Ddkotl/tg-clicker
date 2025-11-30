import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { factsRepository } from "@/entities/facts/index.server";
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

  async updateMissionAndFinish({
    mission_type,
    progress,
    userId,
    tx,
  }: {
    userId: string;
    mission_type: MissionType;
    progress: number;
    tx?: TransactionType;
  }) {
    if (tx) {
      return this._runUpdateMissionAndFinish({
        mission_type,
        progress,
        userId,
        tx,
      });
    }

    return await dataBase.$transaction(async (trx) => {
      return this._runUpdateMissionAndFinish({
        mission_type,
        progress,
        userId,
        tx: trx,
      });
    });
  }
  private async _runUpdateMissionAndFinish({
    mission_type,
    progress,
    userId,
    tx,
  }: {
    userId: string;
    mission_type: MissionType;
    progress: number;
    tx?: TransactionType;
  }) {
    let updated_mission = await this.missionRepo.UpdateProgressMission({ userId, mission_type, progress, tx });
    if (updated_mission?.is_completed && updated_mission?.is_active) {
      const updated_res = await this.profileRepo.updateResources({
        userId: userId,
        resources: {
          qi: updated_mission.reward_qi,
          qi_stone: updated_mission.reward_qi_stone,
          spirit_cristal: updated_mission.reward_spirit_cristal,
          glory: updated_mission.reward_glory,
          exp: updated_mission.reward_exp,
        },
        tx,
      });
      if (!updated_res) throw new Error("Failed to update resources");
      const new_fact = await factsRepository.createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: updated_mission.reward_exp,
        qi_reward: updated_mission.reward_qi,
        reward_spirit_cristal: updated_mission.reward_spirit_cristal,
        qi_stone_reward: updated_mission.reward_qi_stone,
        reward_glory: updated_mission.reward_glory,
        target: updated_mission.target_value,
        mission_type: updated_mission.type,
        tx: tx,
      });
      if (!new_fact) throw new Error("Failed to create fact");
      updated_mission = await this.missionRepo.InactivateMission({
        userId: updated_mission.userId,
        mission_type: updated_mission.type,
        tx: tx,
      });
      if (!updated_mission) throw new Error("Failed to inactivate mission");
    }
    return updated_mission;
  }
}

export const missionService = new MissionService();
