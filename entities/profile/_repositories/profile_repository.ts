import { Profile } from "@/_generated/prisma/client";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { ParamNameType, ResourceUpdateParams } from "../_domain/types";
import { calcParamCost } from "@/shared/game_config/params/params_cost";
import { calcMaxHP } from "@/shared/game_config/params/calc_max_xp";

export class ProfileRepository {
  async getByUserId({ userId, tx }: { userId: string; tx?: TransactionType }) {
    try {
      const db_client = tx ? tx : dataBase;
      const profile = await db_client.profile.findUnique({
        where: { userId: userId },
      });
      return profile;
    } catch (error) {
      console.error("GetProfileByUserId error", error);
      return null;
    }
  }
  async getPofileWithQiSkillsByUserId({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const profile = await db_client.profile.findUnique({
        where: { userId: userId },
        include: {
          user: {
            select: {
              qi_skills: true,
            },
          },
        },
      });
      return profile;
    } catch (error) {
      console.error("getPofilewithQiSkillsByUserId", error);
      return null;
    }
  }

  async update({ data, userId, tx }: { userId: string; data: Partial<Profile>; tx?: TransactionType }) {
    try {
      const db_client = tx ? tx : dataBase;
      return await db_client.profile.update({
        where: { userId: userId },
        data: data,
      });
    } catch (error) {
      console.error("ProfileRepository.update error", error);
      return null;
    }
  }

  async updateFightCharges({
    fight_charges,
    last_charge_recovery,
    userId,
    tx,
  }: {
    userId: string;
    fight_charges: number;
    last_charge_recovery: Date;
    tx?: TransactionType;
  }) {
    return this.update({ userId: userId, data: { last_charge_recovery, fight_charges }, tx: tx });
  }

  async spendFightCharge({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const profile = await this.getByUserId({ userId: userId, tx: tx });
    if (!profile || profile.fight_charges <= 0) return null;
    const now = new Date();
    try {
      return await db_client.profile.update({
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

  async updateResources({ userId, resources, tx }: ResourceUpdateParams & { tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: Record<string, any> = {};

      for (const [key, value] of Object.entries(resources)) {
        if (value === 0 || value === undefined) continue;
        if (typeof value === "number") {
          data[key] = { increment: value };
        } else if (typeof value === "object" && value !== null) {
          if (value.add !== undefined) data[key] = { increment: value.add };
          if (value.remove !== undefined) data[key] = { decrement: value.remove };
        }
      }

      if (Object.keys(data).length === 0) return null;

      return await db_client.profile.update({
        where: { userId },
        data,
      });
    } catch (error) {
      console.error("UpdateResources error:", error);
      return null;
    }
  }

  async updateHP({
    userId,
    current_hitpoint,
    last_hp_update,
    tx,
  }: {
    userId: string;
    current_hitpoint: number;
    last_hp_update: Date;
    tx?: TransactionType;
  }) {
    return this.update({ userId, data: { current_hitpoint, last_hp_update }, tx: tx });
  }
  async updateQi({
    userId,
    current_qi,
    last_qi_update,
    tx,
  }: {
    userId: string;
    current_qi: number;
    last_qi_update: Date;
    tx?: TransactionType;
  }) {
    return this.update({ userId, data: { qi: current_qi, last_qi_update }, tx: tx });
  }
  async updateLvl({ userId, lvl, tx }: { userId: string; lvl: number; tx?: TransactionType }) {
    return this.update({ userId, data: { lvl: lvl }, tx: tx });
  }

  async updateOnline({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      return await db_client.profile.update({
        where: { userId },
        data: {
          last_online_at: new Date(),
        },
      });
    } catch (error) {
      console.error("ProfileRepository.updateOnline error", error);
      return null;
    }
  }

  async updateUserParam({ userId, paramName, tx }: { userId: string; paramName: ParamNameType; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const user = await db_client.user.findUnique({
        where: { id: userId },
        select: { profile: true },
      });

      if (!user || !user.profile) {
        throw new Error("User or profile not found");
      }

      const currentValue = user.profile[paramName];
      const updateCost = calcParamCost(paramName, currentValue);

      if (user.profile.qi < updateCost) {
        throw new Error("Not enough qi");
      }
      const new_max_hitpoints = calcMaxHP({
        power: user.profile.power,
        protection: user.profile.protection,
        speed: user.profile.speed,
        skill: user.profile.skill,
        qi_param: user.profile.qi_param,
        level: user.profile.lvl,
      });
      const updated_user = await db_client.user.update({
        where: { id: userId },
        data: {
          profile: {
            update: {
              [paramName]: { increment: 1 },
              qi: { decrement: updateCost },
              max_hitpoint: new_max_hitpoints,
              last_hp_update: new Date(),
            },
          },
        },
        select: { profile: true },
      });

      return updated_user;
    } catch (error) {
      console.error("Failed to update user param:", error);
      return null;
    }
  }
}

export const profileRepository = new ProfileRepository();
