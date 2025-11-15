import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { FightResult, FightStatus, FightType, EnemyType } from "@/_generated/prisma";
import { FightLogStep, FightResRewards, FightSnapshot } from "../_domain/types";

export class FightRepository {
  async getPendingFightByAtackserId({ attackserId }: { attackserId: string }) {
    try {
      return await dataBase.fight.findFirst({
        where: { attackerId: attackserId, status: FightStatus.PENDING },
      });
    } catch (e) {
      console.error("getPendingFightByAtackserId", e);
      return null;
    }
  }
  async createFight(params: {
    attackerId: string;
    defenderId?: string | null;
    enemyType: EnemyType;
    fightType: FightType;
    status?: FightStatus;
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
  }: {
    fightId: string;
    result: FightResult;
    fightLog: FightLogStep[];
    rewards: FightResRewards;
  }) {
    return dataBase.fight.update({
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
