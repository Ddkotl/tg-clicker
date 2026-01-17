import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma/enums";
import { factsRepository } from "@/entities/facts/index.server";
import { MissionRepository, missionRepository } from "@/entities/missions/index.server";
import { ProfileRepository } from "@/entities/profile/_repositories/profile_repository";
import { profileRepository } from "@/entities/profile/index.server";
import { statisticService, StatisticService } from "@/features/statistic/servise/statistic_servise";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { generateDailyMissions } from "@/shared/game_config/missions/generate_daily_missions";
import { PermanentMission } from "@/shared/game_config/missions/generate_permanent_missions";
import { getChannelInfo } from "@/shared/lib/get_telegram_chanell_info";

export class MissionService {
  constructor(
    private profileRepo: ProfileRepository,
    private missionRepo: MissionRepository,
    private statisticServ: StatisticService,
  ) {}
  async createPermanentMissions({
    permanent_missions,
    userId,
    tx,
  }: {
    permanent_missions: PermanentMission[];
    userId: string;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      for (const m of permanent_missions) {
        const existingMission = await db_client.mission.findFirst({
          where: {
            userId,
            type: m.type,
            chanel_id: m.chanel_id || null,
          },
        });
        const data = await getChannelInfo(m.chanel_id);

        if (existingMission) {
          await db_client.mission.update({
            where: { id: existingMission.id },
            data: {
              chanel_title: data?.title,
              chanel_img: data?.img,
              path: data?.invite_link,
            },
          });
        } else {
          await db_client.mission.create({
            data: {
              userId,
              ...m,
              chanel_title: data?.title,
              chanel_img: data?.img,
              path: data?.invite_link,
            },
          });
        }
      }
    } catch (error) {
      console.error("❌ createPermanentMissions error:", error);
      return null;
    }
  }
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
    missionId,
    tx,
  }: {
    mission_type?: MissionType;
    progress: number;
    userId?: string;
    missionId?: string;
    tx?: TransactionType;
  }) {
    console.log(mission_type, progress, userId, missionId, tx);
    let updated_profile;
    let updated_mission;
    if (missionId) {
      updated_mission = await this.missionRepo.UpdateProgressMissionByMissionId({ missionId, progress, tx });
    }
    if (userId && mission_type) {
      updated_mission = await this.missionRepo.UpdateProgressMission({ userId, mission_type, progress, tx });
    }
    console.log("updated_mission", updated_mission);
    if (updated_mission?.is_completed && updated_mission?.is_active && updated_mission.userId !== undefined) {
      updated_profile = await this.profileRepo.updateResources({
        userId: updated_mission.userId,
        resources: {
          qi: updated_mission.reward_qi,
          qi_stone: updated_mission.reward_qi_stone,
          spirit_cristal: updated_mission.reward_spirit_cristal,
          glory: updated_mission.reward_glory,
          exp: updated_mission.reward_exp,
        },
        tx,
      });
      if (!updated_profile) throw new Error("Failed to update resources");
      const up_stats = await this.statisticServ.udateUserStatistics({
        userId: updated_mission.userId,
        tx,
        data: {
          qi_looted: updated_mission.reward_qi,
          qi_stone_looted: updated_mission.reward_qi_stone,
          exp: updated_mission.reward_exp,
          glory: updated_mission.reward_glory,
          missions: 1,
        },
      });

      if (!up_stats.updated) throw new Error("Cannot update daily stat");

      const new_fact = await factsRepository.createFact({
        userId: updated_mission.userId,
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
        mission_id: updated_mission.id,
        tx: tx,
      });
      if (!updated_mission) throw new Error("Failed to inactivate mission");
    }
    return { updated_mission, updated_profile };
  }
}

export const missionService = new MissionService(profileRepository, missionRepository, statisticService);
