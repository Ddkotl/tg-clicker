import { EnemyType, FactsStatus, FactsType, FightResult, MissionType } from "@/_generated/prisma/enums";
import { FightLog, FightResRewards } from "@/entities/fights";
import { FightResLossesSchema } from "@/entities/fights/_domain/types";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";

export class FactsRepository {
  async createFact({
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
    fight_atacker_id,
    fight_result,
    fightLog,
    rewards,
    losses,
    fight_id,
    enemy_type,
    defender_id,
    tx,
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
    fight_atacker_id?: string;
    fight_result?: FightResult;
    fightLog?: FightLog;
    rewards?: FightResRewards;
    losses?: FightResLossesSchema;
    fight_id?: string;
    enemy_type?: EnemyType;
    defender_id?: string | null;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      const new_fact = await db_client.facts.create({
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
          fight_atacker_id: fight_atacker_id,
          fight_result: fight_result,
          fightLog: fightLog,
          fight_rewards: rewards,
          fight_losses: losses,
          fight_id: fight_id,
          enemy_type: enemy_type,
          fight_defender_id: defender_id,
        },
      });
      return new_fact;
    } catch (error) {
      console.error("createFact error", error);
      return null;
    }
  }
  async deleteOldFacts({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const deleted = await db_client.facts.deleteMany({
        where: {
          userId: userId,
          createdAt: {
            lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        },
      });
      return deleted.count;
    } catch (error) {
      console.error("deleteOldFacts error", error);
      return null;
    }
  }
  async CheckAllFacts({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const res = await db_client.facts.updateMany({
        where: {
          userId: userId,
          status: FactsStatus.NO_CHECKED,
        },
        data: {
          status: FactsStatus.CHECKED,
        },
      });
      return res;
    } catch (error) {
      console.error("CheckAllFacts error", error);
      return null;
    }
  }
  async getFactNocheckCount({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const count = await db_client.facts.count({
        where: { userId: userId, status: "NO_CHECKED" },
      });
      return count;
    } catch (error) {
      console.error("getFactsCount error", error);
      return null;
    }
  }
  async getUserFacts({
    page,
    page_size,
    userId,
    tx,
  }: {
    userId: string;
    page: number;
    page_size: number;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    const skip = (page - 1) * page_size;
    const take = page_size;
    try {
      const facts = await db_client.facts.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      });
      const total = await db_client.facts.count({
        where: { userId },
      });
      const hasNextPage = skip + take < total;
      return {
        facts: facts,
        hasNextPage: hasNextPage,
      };
    } catch (error) {
      console.error("getUserFacts error", error);
      return null;
    }
  }
}

export const factsRepository = new FactsRepository();
