import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { dataBase } from "@/shared/connect/db_connect";
import { getMeditationExperience } from "@/shared/game_config/exp/give_expirience";

export async function giveMeditationReward(userId: string, break_meditation: boolean = false) {
  try {
    if (break_meditation) {
      const spirit_cristal = await dataBase.profile.findUnique({
        where: { userId },
        select: { spirit_cristal: true },
      });
      if ((spirit_cristal?.spirit_cristal || 0) < 10) {
        return null;
      }
    }

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

    const meditation_reward = break_meditation
      ? Math.floor(meditation.meditation_revard / 20)
      : meditation.meditation_revard;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meditationUpdateData: any = {
      meditation_hours: 0,
      on_meditation: false,
      start_meditation: null,
      meditation_revard: null,
    };
    if (break_meditation && meditation.start_meditation) {
      meditationUpdateData.canceled_meditated_dates = { push: meditation.start_meditation };
    }
    const res = await dataBase.$transaction([
      dataBase.meditation.update({
        where: { userId },
        data: meditationUpdateData,
      }),
      dataBase.profile.update({
        where: { userId },
        data: {
          qi: { increment: meditation_reward },
          exp: { increment: meditation_expirience },
          spirit_cristal: { decrement: break_meditation ? 10 : 0 },
        },
      }),
      dataBase.userStatistic.update({
        where: { userId },
        data: {
          meditated_hours: { increment: break_meditation ? 1 : meditation.meditation_hours },
        },
      }),
    ]);
    const lvl_up = await CheckUpdateLvl(userId);
    return {
      userId,
      reward_qi: meditation_reward,
      reward_exp: meditation_expirience,
      hours: meditation.meditation_hours,
      current_qi: res[1].qi,
      current_exp: res[1].exp,
      current_spirit_cristal: res[1].spirit_cristal,
      current_lvl: lvl_up ? lvl_up : res[1].lvl,
    };
  } catch (error) {
    console.error("giveMeditationReward error", error);
    return null;
  }
}
