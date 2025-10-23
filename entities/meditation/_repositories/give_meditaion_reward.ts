import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { dataBase } from "@/shared/connect/db_connect";
import { getMeditationExperience } from "@/shared/game_config/exp/give_expirience";

export async function giveMeditationReward(userId: string) {
  try {
    const meditation = await dataBase.meditation.findUnique({
      where: { userId: userId },
    });
    if (
      meditation === null ||
      meditation?.on_meditation === false ||
      meditation.meditation_hours === null ||
      meditation.meditation_revard === null
    ) {
      return null;
    }
    const meditation_expirience = getMeditationExperience(meditation.meditation_hours);

    const meditation_reward = meditation.meditation_revard;
    const res = await dataBase.$transaction([
      dataBase.meditation.update({
        where: { userId },
        data: {
          meditation_hours: 0,
          on_meditation: false,
          start_meditation: null,
          meditation_revard: null,
        },
      }),
      dataBase.profile.update({
        where: { userId },
        data: {
          mana: { increment: meditation_reward },
          exp: { increment: meditation_expirience },
        },
      }),
      dataBase.userStatistic.update({
        where: { userId },
        data: {
          meditated_hours: { increment: meditation.meditation_hours },
        },
      }),
    ]);
    const lvl_up = await CheckUpdateLvl(userId);
    return {
      userId,
      reward_mana: meditation_reward,
      reward_exp: meditation_expirience,
      hours: meditation.meditation_hours,
      current_mana: res[1].mana,
      current_exp: res[1].exp,
      current_lvl: lvl_up ? lvl_up : res[1].lvl,
    };
  } catch (error) {
    console.error("giveMeditationReward error", error);
    return null;
  }
}
