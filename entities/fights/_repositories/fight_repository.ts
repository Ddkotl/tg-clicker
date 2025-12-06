import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { FightResult, FightStatus, FightType, EnemyType } from "@/_generated/prisma/enums";
import { FightLogStep, FightResRewards, FightSnapshot } from "../_domain/types";

export class FightRepository {
  async getFightByAttackserId({
    attackserId,
    status,
    tx,
  }: {
    attackserId: string;
    status: FightStatus;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      return await db_client.fight.findFirst({
        where: { attackerId: attackserId, status: status },
      });
    } catch (e) {
      console.error("getFightByAttackserId", e);
      return null;
    }
  }
  async getFightById({ fightId, tx }: { fightId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      return await db_client.fight.findFirst({
        where: { id: fightId },
      });
    } catch (e) {
      console.error("getFightById", e);
      return null;
    }
  }
  async createOrUpdateFight(params: {
    attackerId: string;
    defenderId?: string | null;
    enemyType: EnemyType;
    fightType: FightType;
    fightSnapshot: FightSnapshot;
    tx?: TransactionType;
  }) {
    try {
      const db_client = params.tx ? params.tx : dataBase;
      const fight = await db_client.fight.findFirst({
        where: { attackerId: params.attackerId, status: FightStatus.PENDING },
      });
      if (fight) {
        return await db_client.fight.update({
          where: { id: fight.id },
          data: {
            attackerId: params.attackerId,
            defenderId: params.defenderId ?? null,
            enemyType: params.enemyType,
            type: params.fightType,
            status: FightStatus.PENDING,
            snapshot: params.fightSnapshot,
            fightLog: [],
            startedAt: new Date(),
          },
        });
      } else {
      }
      return await db_client.fight.create({
        data: {
          attackerId: params.attackerId,
          defenderId: params.defenderId ?? null,
          enemyType: params.enemyType,
          type: params.fightType,
          status: FightStatus.PENDING,
          snapshot: params.fightSnapshot,
          fightLog: [],
          startedAt: new Date(),
        },
      });
    } catch (e) {
      console.error("createFight", e);
      return null;
    }
  }

  async finishFight({
    fightId,
    fightLog,
    result,
    rewards,
    tx,
  }: {
    fightId: string;
    result: FightResult;
    fightLog: FightLogStep[];
    rewards: FightResRewards;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    return db_client.fight.update({
      where: { id: fightId },
      data: {
        result,
        rewards,
        status: FightStatus.FINISHED,
        fightLog,
        finishedAt: new Date(),
      },
    });
  }
}

export const fightRepository = new FightRepository();
