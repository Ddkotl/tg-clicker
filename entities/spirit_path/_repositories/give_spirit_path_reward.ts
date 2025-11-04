import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { dataBase } from "@/shared/connect/db_connect";
import { getSpiritPathExperience } from "@/shared/game_config/exp/give_expirience";
import { calcSpiritPathSpiritStoneReward } from "../_vm/calc_spirit_path_spirit_stone_reward";
import dayjs from "dayjs";

export async function giveSpiritPathReward(userId: string, break_spirit_path: boolean = false) {
  try {
    // 1️⃣ Проверяем, если пользователь прерывает путь — достаточно ли у него spirit_cristal
    if (break_spirit_path) {
      const profile = await dataBase.profile.findUnique({
        where: { userId },
        select: { spirit_cristal: true },
      });

      if (!profile || profile.spirit_cristal < 10) {
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
      spiritPath.spirit_paths_reward === null ||
      spiritPath.start_spirit_paths === null ||
      spiritPath.minutes_today === null
    ) {
      return null;
    }

    const minutes = spiritPath.spirit_paths_minutes;
    const today = dayjs().startOf("day").toDate();
    const isSameDay = spiritPath.date_today ? dayjs(spiritPath.date_today).isSame(today, "day") : false;
    // 3️⃣ Считаем награды
    const rewardExp = getSpiritPathExperience(minutes);
    const rewardQi = break_spirit_path
      ? Math.floor(spiritPath.spirit_paths_reward / 20)
      : spiritPath.spirit_paths_reward;

    const rewardSpiritStone = calcSpiritPathSpiritStoneReward(minutes);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spiritPathUpdateData: any = {
      on_spirit_paths: false,
      start_spirit_paths: null,
      spirit_paths_minutes: null,
      spirit_paths_reward: null,
      date_today: new Date(),
      minutes_today: isSameDay ? spiritPath.minutes_today : 0,
    };
    if (break_spirit_path && spiritPath.start_spirit_paths) {
      spiritPathUpdateData.canceled_paths_dates = {
        push: spiritPath.start_spirit_paths,
      };
    }
    // 5️⃣ Транзакция: сбрасываем состояние пути, обновляем профиль и счётчик
    const [spirit_path, updatedProfile] = await dataBase.$transaction([
      dataBase.spiritPath.update({
        where: { userId },
        data: spiritPathUpdateData,
      }),
      dataBase.profile.update({
        where: { userId },
        data: {
          qi: { increment: rewardQi },
          exp: { increment: rewardExp },
          spirit_cristal: break_spirit_path ? { decrement: 10 } : { increment: rewardSpiritStone },
        },
      }),
      dataBase.userStatistic.update({
        where: { userId },
        data: {
          spirit_path_minutes: {
            increment: break_spirit_path ? 10 : spiritPath.spirit_paths_minutes,
          },
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
      reward_spirit_cristal: break_spirit_path ? 0 : rewardSpiritStone,
      minutes: minutes,
      current_qi: updatedProfile.qi,
      current_exp: updatedProfile.exp,
      current_spirit_cristal: updatedProfile.spirit_cristal,
      current_lvl: lvl_up ?? updatedProfile.lvl,
      minutes_today: spirit_path.minutes_today,
    };
  } catch (error) {
    console.error("giveSpiritPathReward error", error);
    return null;
  }
}
