import { dataBase } from "@/shared/connect/db_connect";

export async function giveMeditationReward(userId: string) {
  try {
    const meditation = await dataBase.meditation.findUnique({
      where: { userId: userId },
    });
    if (
      meditation === null ||
      meditation?.on_meditation === false ||
      meditation.meditation_hours === null
    ) {
      return null;
    }
    //изменить позже
    const meditation_reward = 1000 * meditation.meditation_hours;
    const res = await dataBase.$transaction([
      dataBase.meditation.update({
        where: { userId },
        data: {
          meditation_hours: 0,
          on_meditation: false,
          start_meditation: null,
        },
      }),
      dataBase.profile.update({
        where: { userId },
        data: {
          mana: { increment: meditation_reward },
        },
      }),
      dataBase.userStatistic.update({
        where: { userId },
        data: {
          meditation_hours_count: { increment: meditation.meditation_hours },
        },
      }),
    ]);
    return {
      userId,
      reward: meditation_reward,
      hours: meditation.meditation_hours,
      current_mana: res[1].mana,
    };
  } catch (error) {
    console.error("giveMeditationReward error", error);
    return null;
  }
}
