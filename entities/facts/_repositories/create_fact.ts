import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function createFact({
  userId,
  fact_type,
  fact_status,
  active_hours,
  exp_reward,
  qi_reward,
  qi_stone_reward,
  active_minutes,
  reward_spirit_cristal,
  reward_glory,
  target,
  mission_type,
}: {
  userId: string;
  fact_type: FactsType;
  fact_status: FactsStatus;
  active_hours?: number;
  qi_reward?: number;
  qi_stone_reward?: number;
  exp_reward?: number;
  active_minutes?: number;
  reward_spirit_cristal?: number;
  reward_glory?: number;
  target?: number;
  mission_type?: MissionType;
}) {
  try {
    const new_fact = await dataBase.facts.create({
      data: {
        userId,
        type: fact_type,
        status: fact_status,
        qi_reward: qi_reward,
        exp_reward: exp_reward,
        active_hours: active_hours,
        active_minutes: active_minutes,
        spirit_cristal_reward: reward_spirit_cristal,
        glory_reward: reward_glory,
        qi_stone_reward: qi_stone_reward,
        target_value: target,
        mission_type: mission_type,
      },
    });
    return new_fact;
  } catch (error) {
    console.error("createFact error", error);
    return null;
  }
}
