import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { dataBase } from "@/shared/connect/db_connect";
import { getSpiritPathExperience } from "@/shared/game_config/exp/give_expirience";
import { calcSpiritPathSpiritStoneReward } from "../_vm/calc_spirit_path_spirit_stone_reward";
import dayjs from "dayjs";

export async function giveSpiritPathReward(userId: string, break_spirit_path: boolean = false) {
  try {
    // 1️⃣ Проверяем, если пользователь прерывает путь — достаточно ли у него spirit_stone
    if (break_spirit_path) {
      const profile = await dataBase.profile.findUnique({
        where: { userId },
        select: { spirit_stone: true },
      });

      if (!profile || profile.spirit_stone < 10) {
        return null;
      }
    }

    // 2️⃣ Получаем текущий SpiritPath
    const spiritPath = await dataBase.spiritPath.findUnique({
      where: { userId },
    });

    if (
      !spiritPath ||
      !spiritPath.on_spirit_paths ||
      spiritPath.spirit_paths_minutes === null ||
      spiritPath.spirit_paths_reward === null
    ) {
      return null;
    }

    const minutes = spiritPath.spirit_paths_minutes;

    // 3️⃣ Считаем награды
    const rewardExp = getSpiritPathExperience(minutes);
    const rewardQi = break_spirit_path
      ? Math.floor(spiritPath.spirit_paths_reward / 20)
      : spiritPath.spirit_paths_reward;

    const rewardSpiritStone = calcSpiritPathSpiritStoneReward(minutes);

    // 4️⃣ Считаем дату (для обновления minutes_today)
    const today = dayjs().startOf("day").toDate();
    const sameDay = spiritPath.date_today ? dayjs(spiritPath.date_today).isSame(today, "day") : false;

    // 5️⃣ Транзакция: сбрасываем состояние пути, обновляем профиль и счётчик
    const [spirit_path, updatedProfile] = await dataBase.$transaction([
      dataBase.spiritPath.update({
        where: { userId },
        data: {
          on_spirit_paths: false,
          start_spirit_paths: null,
          spirit_paths_minutes: null,
          spirit_paths_reward: null,
          minutes_today: sameDay ? { increment: minutes } : minutes, // если новый день — перезаписываем
          date_today: new Date(),
        },
      }),
      dataBase.profile.update({
        where: { userId },
        data: {
          qi: { increment: rewardQi },
          exp: { increment: rewardExp },
          spirit_stone: {
            increment: break_spirit_path ? 0 : rewardSpiritStone,
            decrement: break_spirit_path ? 10 : 0,
          },
        },
      }),
      dataBase.userStatistic.update({
        where: { userId },
        data: {
          spirit_path_minutes: { increment: break_spirit_path ? 10 : spiritPath.spirit_paths_minutes },
        },
      }),
    ]);

    // 6️⃣ Проверка повышения уровня
    const lvl_up = await CheckUpdateLvl(userId);

    // 7️⃣ Возврат данных
    return {
      userId,
      reward_qi: rewardQi,
      reward_exp: rewardExp,
      reward_spirit_stone: rewardSpiritStone,
      minutes: minutes,
      current_qi: updatedProfile.qi,
      current_exp: updatedProfile.exp,
      current_spirit_stone: updatedProfile.spirit_stone,
      current_lvl: lvl_up ?? updatedProfile.lvl,
      minutes_today: spirit_path.minutes_today,
    };
  } catch (error) {
    console.error("giveSpiritPathReward error", error);
    return null;
  }
}
