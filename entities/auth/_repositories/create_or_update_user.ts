import { dataBase } from "@/shared/connect/db_connect";
import { CreateUserType } from "../_domain/types";

export async function UpdateOrCreateUser(user: CreateUserType, referer_id?: string) {
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
        user_statistic: { create: {} },
        meditation: { create: {} },
        mine: { create: {} },
        job: { create: {} },
      },
      update: {
        username: user.username || null,
        photo_url: user.photo_url || null,
        auth_date: user.auth_date || null,
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
