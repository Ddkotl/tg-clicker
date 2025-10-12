import { Fraktion } from "@/_generated/prisma";
import { dataBase } from "@/shared/utils/db_connect";

export async function getUserByTgId(telegram_id: string) {
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
export type getUserByTgIdType = Awaited<ReturnType<typeof getUserByTgId>>;

export async function getUserProfileByUserId(userId: string) {
  try {
    const user = await dataBase.user.findUnique({
      where: { id: userId },
      select: {
        profile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("не удалось найти пользователя", error);
    return null;
  }
}
export type getUserProfileByUserIdType = Awaited<
  ReturnType<typeof getUserProfileByUserId>
>;
