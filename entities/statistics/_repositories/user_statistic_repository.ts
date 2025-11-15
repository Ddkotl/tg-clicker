import { dataBase } from "@/shared/connect/db_connect";

export class UserStatisticRepository {
  async ensureStats(userId: string) {
    // create if not exists (upsert)
    return dataBase.userStatistic.upsert({
      where: { userId },
      create: { userId, fights_total: 0 },
      update: {},
    });
  }

  async updateAfterFight(userId: string, result: "WIN" | "LOSE" | "DRAW", isPveShadowWin = false) {
    const data: any = { fights_total: { increment: 1 } };
    if (result === "WIN") data.fights_wins = { increment: 1 };
    if (result === "LOSE") data.fights_loses = { increment: 1 };
    if (isPveShadowWin) data.pve_shadow_wins = { increment: 1 };

    return dataBase.userStatistic.update({ where: { userId }, data });
  }
}

export const userStatisticRepository = new UserStatisticRepository();
