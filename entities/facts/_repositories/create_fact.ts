import { FactsStatus, FactsType } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function createFact({
  userId,
  fact_type,
  fact_status,
  active_hours,
  exp_reward,
  mana_reward,
}: {
  userId: string;
  fact_type: FactsType;
  fact_status: FactsStatus;
  active_hours?: number;
  mana_reward?: number;
  exp_reward?: number;
}) {
  try {
    const new_fact = await dataBase.facts.create({
      data: {
        userId,
        type: fact_type,
        status: fact_status,
        mana_reward: mana_reward,
        exp_reward: exp_reward,
        active_hours: active_hours,
      },
    });
    return new_fact;
  } catch (error) {
    console.error("createFact error", error);
    return null;
  }
}
