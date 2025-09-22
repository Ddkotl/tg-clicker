import { CreateUserType } from "@/types/user_types";
import { dataBase } from "@/utils/db_connect";

export async function CreateUser(user: CreateUserType, referer_id?: string) {
  try {
    const find_user = await dataBase.user.findUnique({
      where: { telegram_id: user.telegram_id },
    });
    if (find_user) {
      return find_user;
    }
    const created_user = await dataBase.user.create({
      data: {
        telegram_id: user.telegram_id,
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        photo_url: user.photo_url || null,
        referrerId: referer_id,
        profile: { create: {} },
      },
    });

    return created_user;
  } catch (error) {
    console.error("не удалось создать пользователя", error);
    return null;
  }
}

export async function getUserByTgId(telegram_id: string) {
  try {
    const user = await dataBase.user.findUnique({
      where: { telegram_id: telegram_id },
      omit: {
        referrerId: true,
        telegram_id: true,
        first_name: true,
        last_name: true,
      },
      include: {
        profile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("не удалось найти пользователя", error);
    return null;
  }
}
export type getUserByTgIdType = Awaited<ReturnType<typeof getUserByTgId>>;
