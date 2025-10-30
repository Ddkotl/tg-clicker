import { FactsStatus, FactsType } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function createFact({
  userId,
  fact_type,
  fact_status,
  active_hours,
  exp_reward,
  qi_reward,
  active_minutes,
  reward_spirit_stone,
}: {
  userId: string;
  fact_type: FactsType;
  fact_status: FactsStatus;
  active_hours?: number;
  qi_reward?: number;
  exp_reward?: number;
  active_minutes?: number;
  reward_spirit_stone?: number;
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
        spitit_stone_reward: reward_spirit_stone,
      },
    });
    return new_fact;
  } catch (error) {
    console.error("createFact error", error);
    return null;
  }
}
