import { Fraktion } from "@/_generated/prisma";
import { CreateUserType } from "@/types/user_types";
import { dataBase } from "@/utils/db_connect";

export async function UpdateOrCreateUser(
  user: CreateUserType,
  referer_id?: string,
) {
  try {
    const updated_user = await dataBase.user.upsert({
      where: { telegram_id: user.telegram_id },
      create: {
        telegram_id: user.telegram_id,
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        photo_url: user.photo_url || null,
        language_code: user.language_code || null,
        auth_date: user.auth_date || null,
        allows_write_to_pm: user.allows_write_to_pm || null,
        referrerId: referer_id || null,
        profile: { create: {} },
      },
      update: {
        telegram_id: user.telegram_id,
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        photo_url: user.photo_url || null,
        language_code: user.language_code || null,
        auth_date: user.auth_date || null,
        allows_write_to_pm: user.allows_write_to_pm || null,
      },
      include: {
        profile: {
          select: {
            nikname: true,
            color_theme: true,
          },
        },
      },
    });
    return updated_user;
  } catch (error) {
    console.error("не удалось создать пользователя", error);
    return null;
  }
}
export type UpdateOrCreateUserType = Awaited<
  ReturnType<typeof UpdateOrCreateUser>
>;
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

export async function getUserCountsInFractions() {
  try {
    const adepts = await dataBase.user.count({
      where: {
        profile: {
          fraktion: Fraktion.ADEPT,
        },
      },
    });
    const novices = await dataBase.user.count({
      where: {
        profile: {
          fraktion: Fraktion.NOVICE,
        },
      },
    });
    return { adepts: adepts, novices: novices };
  } catch (error) {
    console.error("not found users", error);
    return {};
  }
}
export type getUserCountsInFractionsType = Awaited<
  ReturnType<typeof getUserCountsInFractions>
>;
