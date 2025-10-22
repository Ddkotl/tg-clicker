import { dataBase } from "@/shared/connect/db_connect";

export async function giveMineRevard(userId: string, reward: number, exp: number, last_mine_at: Date) {
  try {
    const [mine, profile, stats, fact] = await dataBase.$transaction([
      dataBase.mine.update({
        where: { userId },
        data: {
          energy: { decrement: 1 },
          last_mine_at,
        },
      }),
      dataBase.profile.update({
        where: { userId },
        data: {
          gold: { increment: reward },
          exp: { increment: exp },
        },
      }),
      dataBase.userStatistic.update({
        where: { userId },
        data: {
          mined_count: { increment: 1 },
          mined_gold: { increment: reward },
        },
      }),
      dataBase.facts.create({
        data: {
          userId,
          status: "CHECKED",
          type: "MINE",
          exp_reward: exp,
          gold_reward: reward,
        },
      }),
    ]);

    return { mine, profile, stats, fact };
  } catch (error) {
    console.error("giveMineRevard error:", error);
    return null;
  }
}
