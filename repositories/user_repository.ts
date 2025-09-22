import { User } from "@/prisma/_generated/prisma";
import { CreateUserType } from "@/types/user_types";
import { dataBase } from "@/utils/db_connect";

export async function CreateUser(user: CreateUserType, referer_id?: string) {
  try {
    await dataBase.user.upsert({
      where: { telegram_id: BigInt(user.telegram_id) },
      update: {
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        photo_url: user.photo_url || null,
      },
      create: {
        telegram_id: BigInt(user.telegram_id),
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        photo_url: user.photo_url || null,
        referrerId: referer_id || null,
      },
    });
    return true;
  } catch (error) {
    console.error("не удалось создать пользователя", error);
    return false;
  }
}

export async function getUserByTgId(telegram_id: string): Promise<User | null> {
  try {
    const user = await dataBase.user.findUnique({
      where: { telegram_id: BigInt(telegram_id) },
    });
    return user;
  } catch (error) {
    console.error("не удалось найти пользователя", error);
    return null;
  }
}
export async function applyPassiveIncomeToUser(userId: string) {
  const user = await dataBase.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const now = new Date();
  const ms = now.getTime() - user.lastPassiveUpdate.getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes <= 0) return user;
  const earned = BigInt(Math.floor((minutes * user.passiveIncomePerHour) / 60));
  const newPoints = user.points + earned;
  const newDate = new Date(user.lastPassiveUpdate.getTime() + minutes * 60000);
  return dataBase.user.update({
    where: { id: userId },
    data: { points: newPoints, lastPassiveUpdate: newDate },
  });
}
export async function claimDaily(userId: string) {
  const user = await dataBase.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, message: "No user" };
  const now = new Date();
  const last = user.lastDailyClaimAt;
  if (last) {
    const diff = now.getTime() - last.getTime();
    if (diff < 24 * 3600_000) {
      return { ok: false, message: "Already claimed" };
    }
  }
  // streak logic
  let streak = user.dailyStreak ?? 0;
  if (!last || now.getTime() - last.getTime() > 48 * 3600_000) {
    streak = 1;
  } else {
    streak = Math.min(streak + 1, 7);
  }
  const base = 100;
  const reward = BigInt(Math.round(base * (1 + 0.1 * (streak - 1))));
  const newPoints = user.points + reward;
  const updated = await dataBase.user.update({
    where: { id: userId },
    data: { points: newPoints, lastDailyClaimAt: now, dailyStreak: streak },
  });
  return { ok: true, reward: reward.toString(), user: updated };
}

export async function upgradePassive(userId: string) {
  const user = await dataBase.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, message: "No user" };
  const level = user.passiveLevel + 1;
  const baseCost = 100;
  const growth = 1.6;
  const cost = BigInt(Math.round(baseCost * Math.pow(growth, level - 1)));
  if (user.points < cost) return { ok: false, message: "Not enough points" };
  // increase income: baseDelta 3 growth 1.2
  const added = Math.round(3 * Math.pow(1.2, level - 1));
  const newPoints = user.points - cost;
  const updated = await dataBase.user.update({
    where: { id: userId },
    data: { points: newPoints, passiveIncomePerHour: user.passiveIncomePerHour + added, passiveLevel: level },
  });
  return { ok: true, added, cost: cost.toString(), user: updated };
}
