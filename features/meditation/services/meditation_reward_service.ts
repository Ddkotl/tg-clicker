import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma/enums";
import { pushToSubscriber } from "@/shared/connect/redis_connect";
import { factsRepository } from "@/entities/facts/index.server";

import { giveMeditationReward } from "@/entities/meditation/index.server";
import { missionRepository } from "@/entities/missions/index.server";
import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { profileRepository } from "@/entities/profile/index.server";
import { statisticRepository } from "@/entities/statistics/index.server";

export async function MeditationRewardService(userId: string, break_meditation?: boolean) {
  const res = await giveMeditationReward(userId, break_meditation);
  await statisticRepository.updateUserDailyStats({
    userId: userId,
    data: {
      exp: res?.reward_exp,
      meditated_hours: res?.hours,
    },
  });
  const new_fact = await factsRepository.createFact({
    fact_type: FactsType.MEDITATION,
    fact_status: FactsStatus.NO_CHECKED,
    userId: userId,
    active_hours: res?.hours,
    exp_reward: res?.reward_exp,
    qi_reward: res?.reward_qi,
  });
  if (new_fact !== null) {
    await pushToSubscriber(userId, new_fact.type);
  }
  const completed_missions = [];
  if (!break_meditation && res?.hours) {
    const meditation_mission = await missionRepository.UpdateProgressMission({
      userId: userId,
      mission_type: MissionType.MEDITATION,
      progress: res.hours,
    });
    if (meditation_mission?.is_completed && meditation_mission?.is_active) {
      await profileRepository.updateResources({
        userId,
        resources: {
          qi: meditation_mission.reward_qi,
          qi_stone: meditation_mission.reward_qi_stone,
          spirit_cristal: meditation_mission.reward_spirit_cristal,
          glory: meditation_mission.reward_glory,
          exp: meditation_mission.reward_exp,
        },
      });
      await statisticRepository.updateUserDailyStats({
        userId: userId,
        data: {
          exp: meditation_mission.reward_exp,
        },
      });
      await factsRepository.createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: meditation_mission.reward_exp,
        qi_reward: meditation_mission.reward_qi,
        reward_spirit_cristal: meditation_mission.reward_spirit_cristal,
        qi_stone_reward: meditation_mission.reward_qi_stone,
        reward_glory: meditation_mission.reward_glory,
        target: meditation_mission.target_value,
        mission_type: meditation_mission.type,
      });
      await missionRepository.InactivateMission({
        mission_id: meditation_mission.id,
      });
      completed_missions.push(meditation_mission);
    }
  }
  const lvl = await CheckUpdateLvl(userId);
  return { res, lvl, completed_missions };
}
