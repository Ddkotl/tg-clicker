import { CreateUserType } from "@/entities/auth";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { getStartOfToday } from "@/shared/lib/date";

export class UserRepository {
  async getUserById({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    return await db_client.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }
  async getUserByTelegramId({ telegramId, tx }: { telegramId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    return await db_client.user.findUnique({
      where: { telegram_id: telegramId },
      include: { profile: true },
    });
  }

  async getReferer({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const refererId = await db_client.user.findUnique({
      where: { id: userId },
      select: {
        referrerId: true,
      },
    });
    return await this.getUserByTelegramId({ telegramId: refererId?.referrerId || "", tx });
  }

  async getReferrals({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const user = await this.getUserById({ userId, tx });
    if (!user) return [];
    return await db_client.user.findMany({
      where: { referrerId: user.telegram_id },
      include: { profile: true },
    });
  }

  async updateOrCreateUser({
    user,
    tx,
    referer_id,
  }: {
    user: CreateUserType;
    referer_id?: string;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      const updated_user = await db_client.user.upsert({
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
          profile: {
            create: {
              last_charge_recovery: getStartOfToday(),
              last_qi_update: getStartOfToday(),
              last_fight_time: getStartOfToday(),
              last_hp_update: getStartOfToday(),
            },
          },
          user_statistic: { create: {} },
          meditation: { create: {} },
          qi_skills: { create: {} },
          mine: {
            create: {
              last_mine_at: getStartOfToday(),
              last_energy_at: getStartOfToday(),
            },
          },
          spirit_path: { create: {} },
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
      console.error("UpdateOrCreateUser error", error);
      return null;
    }
  }
}
export const userRepository = new UserRepository();
