import { dataBase } from "@/shared/connect/db_connect";
import { lvl_exp } from "@/shared/game_config/exp/lvl_exp";

export async function CheckUpdateLvl(userId: string) {
  try {
    const profile = await dataBase.profile.findUnique({
      where: { userId },
    });
    if (!profile) throw new Error("User profile not found");

    const { exp, lvl } = profile;
    let newLvl = lvl;

    while (lvl_exp[newLvl + 1] !== undefined && exp >= lvl_exp[newLvl + 1]) {
      newLvl += 1;
    }

    if (newLvl !== lvl) {
      await dataBase.profile.update({
        where: { userId },
        data: { lvl: newLvl },
      });
    }

    return newLvl;
  } catch (error) {
    console.error("update lvl error", error);
    return null;
  }
}
