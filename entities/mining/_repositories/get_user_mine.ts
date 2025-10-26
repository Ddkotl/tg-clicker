import { dataBase } from "@/shared/connect/db_connect";
import { MAX_ENERGY } from "@/shared/game_config/mining/mining_const";

export async function GetUserMine(userId: string) {
  try {
    let user_mine = await dataBase.mine.findUnique({
      where: {
        userId: userId,
      },
    });
    if (user_mine?.energy === MAX_ENERGY) {
      user_mine = await dataBase.mine.update({
        where: {
          userId: userId,
        },
        data: {
          last_energy_at: new Date(),
        },
      });
    }
    return user_mine;
  } catch (error) {
    console.error("GetUserMine error", error);
    return null;
  }
}
