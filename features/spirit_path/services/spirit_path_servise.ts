import { FactsStatus, FactsType, MissionType, SpiritPath } from "@/_generated/prisma/client";
import { FactsRepository, factsRepository } from "@/entities/facts/index.server";
import { profileRepository, ProfileRepository } from "@/entities/profile/_repositories/profile_repository";
import {
  spiritPathRepository,
  SpiritPathRepository,
} from "@/entities/spirit_path/_repositories/spirit_path_repository";
import { calcSpiritPathSpiritCristalReward } from "@/entities/spirit_path/_vm/calc_spirit_path_spirit_cristal_reward";
import { missionService, MissionService } from "@/features/missions/servisces/mission_service";
import { profileService, ProfileService } from "@/features/profile/services/profile_service";
import { statisticService, StatisticService } from "@/features/statistic/servise/statistic_servise";
import { TransactionType } from "@/shared/connect/db_connect";
import { pushToSubscriber } from "@/shared/connect/redis_connect";
import {
  SPIRIT_PATH_BREACK_COST,
  SPIRIT_PATH_BREACK_REVARD_MULTIPLIER,
  SPIRIT_PATH_MAX_MINUTES_PER_DAY,
} from "@/shared/game_config/consts";
import { getSpiritPathExperience } from "@/shared/game_config/exp/give_expirience";
import { getStartOfToday, isSameDay } from "@/shared/lib/date";

export class SpiritPathServise {
  constructor(
    private spiritRepo: SpiritPathRepository,
    private profileRepo: ProfileRepository,
    private factsRepo: FactsRepository,
    private profileServ: ProfileService,
    private statisticServ: StatisticService,
    private missionServ: MissionService,
  ) {}
  async canGoSpiritPath({
    minutes,
    userId,
    tx,
  }: {
    userId: string;
    minutes: number;
    spirit_path_reward: number;
    tx?: TransactionType;
  }) {
    try {
      const spirit_path = await this.spiritRepo.getSpiritPathInfo({ userId, tx });

      if (!spirit_path || spirit_path?.on_spirit_paths) return { canGo: false };

      const today = getStartOfToday();
      const sameDay = spirit_path.date_today ? isSameDay(today, spirit_path.date_today) : false;

      const minutesToday = sameDay ? spirit_path.minutes_today : 0;
      const totalMinutes = minutesToday + minutes;

      if (totalMinutes > SPIRIT_PATH_MAX_MINUTES_PER_DAY) {
        return false;
      }
      return { canGo: true, sameDay };
    } catch (error) {
      console.error("canGoSpiritPath error", error);
      return { canGo: false };
    }
  }
  async goSpiritPath({
    minutes,
    spirit_path_reward,
    userId,
    tx,
  }: {
    userId: string;
    minutes: number;
    spirit_path_reward: number;
    tx?: TransactionType;
  }) {
    try {
      const canGoSpiritPath = await this.canGoSpiritPath({ minutes, spirit_path_reward, userId, tx });
      if (!canGoSpiritPath || canGoSpiritPath.canGo === false) throw new Error("Can hot go spirit path");
      const started_path = await this.spiritRepo.startSpiritPath({
        userId,
        minutes,
        spirit_path_reward,
        sameDay: canGoSpiritPath.sameDay || false,
        tx,
      });
      console.log("started_path", started_path);
      if (!started_path) throw new Error("Cannot start spirit path");
      return started_path;
    } catch (error) {
      console.error("goSpiritPath error", error);
      throw new Error("goSpiritPath error");
    }
  }

  async giveSpiritPathReward({
    userId,
    break_spirit_path = false,
    tx,
  }: {
    userId: string;
    break_spirit_path: boolean;
    tx?: TransactionType;
  }) {
    try {
      if (break_spirit_path) {
        const profile = await this.profileRepo.getByUserId({ userId, tx });

        if (!profile || profile.spirit_cristal < SPIRIT_PATH_BREACK_COST) {
          throw new Error("Not enought resource");
        }
      }
      const spirit_path = await this.spiritRepo.getSpiritPathInfo({ userId, tx });
      console.log("spirit_path", spirit_path);
      if (
        !spirit_path ||
        !spirit_path.on_spirit_paths ||
        spirit_path.spirit_paths_minutes === null ||
        spirit_path.spirit_paths_reward === null ||
        spirit_path.start_spirit_paths === null
      ) {
        throw new Error("No active spirit path");
      }

      const today = getStartOfToday();
      const sameDay = spirit_path.date_today ? isSameDay(today, spirit_path.date_today) : false;
      const minutes = spirit_path.spirit_paths_minutes;
      const rewardExp = getSpiritPathExperience(minutes);
      const rewardQi = break_spirit_path
        ? Math.floor(spirit_path.spirit_paths_reward * SPIRIT_PATH_BREACK_REVARD_MULTIPLIER)
        : spirit_path.spirit_paths_reward;

      const reward_spirit_cristal = calcSpiritPathSpiritCristalReward(minutes);
      const spiritPathUpdateData: Partial<SpiritPath> = {
        on_spirit_paths: false,
        start_spirit_paths: null,
        spirit_paths_minutes: null,
        spirit_paths_reward: null,
        date_today: new Date(),
        minutes_today: sameDay ? spirit_path.minutes_today : 0,
        canceled_paths_dates: [],
      };
      if (break_spirit_path && spirit_path.start_spirit_paths) {
        spiritPathUpdateData.canceled_paths_dates = [
          ...(spirit_path.canceled_paths_dates.filter((el) => isSameDay(today, el)) || []),
          spirit_path.start_spirit_paths,
        ];
      }
      const updated_spirit_path = await this.spiritRepo.endSpiritPAth({
        userId,
        data: spiritPathUpdateData,
        tx,
      });
      console.log("updated_spirit_path", updated_spirit_path);
      if (!updated_spirit_path) throw new Error("Cannot end spirit path");
      let updated_profile = await this.profileRepo.updateResources({
        userId,
        tx,
        resources: {
          qi: { add: rewardQi },
          exp: { add: rewardExp },
          spirit_cristal: break_spirit_path ? { remove: SPIRIT_PATH_BREACK_COST } : { add: reward_spirit_cristal },
        },
      });
      if (!updated_profile) throw new Error("Cannot update profile");
      const up_stats = await this.statisticServ.udateUserStatistics({
        userId,
        tx,
        data: {
          qi_looted: rewardQi,
          exp: rewardExp,
          spirit_path_minutes: break_spirit_path ? 10 : minutes,
        },
      });

      if (!up_stats.updated) throw new Error("Cannot update daily stat");
      const new_fact = await this.factsRepo.createFact({
        fact_type: FactsType.SPIRIT_PATH,
        fact_status: FactsStatus.NO_CHECKED,
        userId: userId,
        active_minutes: minutes,
        exp_reward: rewardExp,
        qi_reward: rewardQi,
        reward_spirit_cristal: break_spirit_path ? 0 : reward_spirit_cristal,
        tx,
      });
      console.log("new_fact", new_fact);
      if (!new_fact) throw new Error("Cannot create fact");
      await pushToSubscriber(userId, new_fact.type);

      const completed_missions = [];
      if (!break_spirit_path && minutes) {
        const result = await this.missionServ.updateMissionAndFinish({
          userId: userId,
          mission_type: MissionType.SPIRIT_PATH,
          progress: minutes,
          tx,
        });
        if (!result) throw new Error("updateMissionAndFinish error");
        const { updated_mission, updated_profile: updated_profile_for_mission } = result;
        console.log("updated_mission", updated_mission);
        console.log("updated_profile_for_mission", updated_profile_for_mission);
        if (!updated_mission) throw new Error("updated_mission error");
        if (
          updated_mission?.is_active === false &&
          updated_mission.is_completed === true &&
          updated_profile_for_mission
        ) {
          completed_missions.push(updated_mission);
          updated_profile = updated_profile_for_mission;
        }
      }
      const lvl_up = await this.profileServ.CheckUpdateLvl({ userId, tx });

      return {
        res: {
          userId,
          reward_qi: rewardQi,
          reward_exp: rewardExp,
          reward_spirit_cristal: break_spirit_path ? 0 : reward_spirit_cristal,
          minutes: minutes,
          current_qi: updated_profile.qi,
          current_exp: updated_profile.exp,
          current_spirit_cristal: updated_profile.spirit_cristal,
          current_lvl: lvl_up,
          minutes_today: updated_spirit_path.minutes_today,
        },
        newLlvl: lvl_up,
        completed_missions,
      };
    } catch (error) {
      console.error("giveSpiritPathReward error", error);
      throw new Error("giveSpiritPathReward error");
    }
  }
}

export const spiritPathServise = new SpiritPathServise(
  spiritPathRepository,
  profileRepository,
  factsRepository,
  profileService,
  statisticService,
  missionService,
);
