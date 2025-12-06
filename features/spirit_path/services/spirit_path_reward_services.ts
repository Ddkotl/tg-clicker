import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma/enums";
import { pushToSubscriber } from "@/shared/connect/redis_connect";
import { factsRepository } from "@/entities/facts/index.server";
import { missionRepository } from "@/entities/missions/index.server";
import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { profileRepository } from "@/entities/profile/index.server";
import { giveSpiritPathReward } from "@/entities/spirit_path/_repositories/give_spirit_path_reward";
import { statisticRepository } from "@/entities/statistics/index.server";

export async function SpiritPathRewardServices(userId: string, break_spirit_path?: boolean) {
  const res = await giveSpiritPathReward(userId, break_spirit_path);
  await statisticRepository.updateUserDailyStats({
    userId: userId,
    data: {
      exp: res?.reward_exp,
      spirit_path_minutes: res?.minutes,
    },
  });
  const new_fact = await factsRepository.createFact({
    fact_type: FactsType.SPIRIT_PATH,
    fact_status: FactsStatus.NO_CHECKED,
    userId: userId,
    active_minutes: res?.minutes,
    exp_reward: res?.reward_exp,
    qi_reward: res?.reward_qi,
    reward_spirit_cristal: res?.reward_spirit_cristal,
  });
  if (new_fact !== null) {
    await pushToSubscriber(userId, new_fact.type);
  }
  const completed_missions = [];
  if (!break_spirit_path && res?.minutes) {
    const spirit_path_mission = await missionRepository.UpdateProgressMission({
      userId: userId,
      mission_type: MissionType.SPIRIT_PATH,
      progress: res.minutes,
    });
    if (spirit_path_mission?.is_completed && spirit_path_mission?.is_active) {
      await profileRepository.updateResources({
        userId,
        resources: {
          qi: spirit_path_mission.reward_qi,
          qi_stone: spirit_path_mission.reward_qi_stone,
          spirit_cristal: spirit_path_mission.reward_spirit_cristal,
          glory: spirit_path_mission.reward_glory,
          exp: spirit_path_mission.reward_exp,
        },
      });
      await statisticRepository.updateUserDailyStats({
        userId: userId,
        data: {
          exp: spirit_path_mission.reward_exp,
        },
      });
      await factsRepository.createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: spirit_path_mission.reward_exp,
        qi_reward: spirit_path_mission.reward_qi,
        reward_spirit_cristal: spirit_path_mission.reward_spirit_cristal,
        qi_stone_reward: spirit_path_mission.reward_qi_stone,
        reward_glory: spirit_path_mission.reward_glory,
        target: spirit_path_mission.target_value,
        mission_type: spirit_path_mission.type,
      });
      await missionRepository.InactivateMission({
        userId: spirit_path_mission.userId,
        mission_type: spirit_path_mission.type,
      });
      completed_missions.push(spirit_path_mission);
    }
  }
  const lvl = await CheckUpdateLvl(userId);
  return { res, lvl, completed_missions };
}
