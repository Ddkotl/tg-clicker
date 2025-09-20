import { User } from "@/app/generated/prisma";
import { CreateUserType } from "@/types/user_types";
import { dataBase } from "@/utils/db_connect";

export async function CreateUser(user: CreateUserType) {
  try {
    await dataBase.user.upsert({
      where: { telegram_id: user.telegram_id },
      update: {
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        language_code: user.language_code || null,
        photo_url: user.photo_url || null,
      },
      create: {
        telegram_id: user.telegram_id,
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        language_code: user.language_code || null,
        photo_url: user.photo_url || null,
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
      where: { telegram_id: telegram_id },
    });
    return user;
  } catch (error) {
    console.error("не удалось найти пользователя", error);
    return null;
  }
}

export async function addPointsToUser(points: number, telegram_id: string): Promise<User | null> {
  try {
    const user = await dataBase.user.update({
      where: { telegram_id: telegram_id },
      data: {
        points: {
          increment: points,
        },
      },
    });
    return user;
  } catch (error) {
    console.error("не удалось добавить пользователю очки", error);
    return null;
  }
}
