import { CreateUserType } from "@/types/user_types";
import { dataBase } from "@/utils/db_connect";

export async function CreateUser(user: CreateUserType) {
  console.log(user);
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
