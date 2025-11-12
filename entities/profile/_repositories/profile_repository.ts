import { Profile } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export class ProfileRepository {
  async getByUserId(userId: string) {
    try {
      const profile = await dataBase.profile.findUnique({
        where: { userId: userId },
      });
      return profile;
    } catch (error) {
      console.error("GetProfileByUserId error", error);
      return null;
    }
  }

  async update(userId: string, data: Partial<Profile>) {
    try {
      return await dataBase.profile.update({
        where: { userId: userId },
        data: data,
      });
    } catch (error) {
      console.error("ProfileRepository.update error", error);
      return null;
    }
  }

  async updateFightCharges(userId: string, fight_charges: number, last_charge_recovery: Date) {
    return this.update(userId, { last_charge_recovery, fight_charges });
  }

  async spendFightCharge(userId: string) {
    const profile = await this.getByUserId(userId);
    if (!profile || profile.fight_charges <= 0) return null;
    const now = new Date();
    try {
      return await dataBase.profile.update({
        where: { userId },
        data: {
          fight_charges: { decrement: 1 },
          last_fight_time: now,
        },
      });
    } catch (error) {
      console.error("ProfileRepository.spendFightCharge error", error);
      return null;
    }
  }
}

export const profileRepository = new ProfileRepository();
