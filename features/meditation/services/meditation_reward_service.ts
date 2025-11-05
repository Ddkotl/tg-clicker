import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { createFact } from "@/entities/facts/index.server";
import { giveMeditationReward } from "@/entities/meditation/index.server";
import { GetResources, InactivateMission, UpdateProgressMission } from "@/entities/missions/index.server";
import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";

export async function MeditationRewardService(userId: string, break_meditation?: boolean) {
  const res = await giveMeditationReward(userId, break_meditation);
  const new_fact = await createFact({
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
    const meditation_mission = await UpdateProgressMission(userId, MissionType.MEDITATION, res.hours);
    if (meditation_mission?.is_completed && meditation_mission?.is_active) {
      await GetResources({
        userId,
        qi: meditation_mission.reward_qi,
        qi_stone: meditation_mission.reward_qi_stone,
        spirit_cristal: meditation_mission.reward_spirit_cristal,
        glory: meditation_mission.reward_glory,
        exp: meditation_mission.reward_exp,
      });
      await createFact({
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
      await InactivateMission(meditation_mission.userId, meditation_mission.type);
      completed_missions.push(meditation_mission);
    }
  }
  const lvl = await CheckUpdateLvl(userId);
  return { res, lvl, completed_missions };
}
