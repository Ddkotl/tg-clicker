import { profileRepository } from "@/entities/profile/index.server";
import { TransactionType } from "@/shared/connect/db_connect";
import { lvl_exp } from "@/shared/game_config/exp/lvl_exp";
import { getPastedIntervals } from "@/shared/game_config/getPastedIntervals";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";
import { getQiRegenPerInterval, QI_REGEN_INTERVAL } from "@/shared/game_config/params/qi_regen";

export class ProfileService {
  constructor(private profileRepo = profileRepository) {}

  async recalcHp({ userId, tx }: { userId: string; tx?: TransactionType }) {
    try {
      const profile = await profileRepository.getByUserId({ userId, tx });
      if (!profile || !profile.last_hp_update) return null;

      const now = new Date().getTime();
      const last = profile.last_hp_update.getTime();
      const { new_last_action_date, past_intervals } = getPastedIntervals({
        now_ms: now,
        last_action_ms: last,
        interval_ms: HP_REGEN_INTERVAL,
      });
      if (past_intervals <= 0) return profile.current_hitpoint;

      const regenAmount = Math.ceil(profile.max_hitpoint * HP_REGEN_PERCENT * past_intervals);
      const newHp = Math.min(profile.current_hitpoint + regenAmount, profile.max_hitpoint);
      await profileRepository.updateHP({
        userId: userId,
        current_hitpoint: newHp,
        last_hp_update: new_last_action_date,
        tx: tx,
      });

      return newHp;
    } catch (err) {
      console.error("recalcHp error:", err);
      return null;
    }
  }

  async recalcQi({ userId, tx }: { userId: string; tx?: TransactionType }) {
    try {
      const profile = await profileRepository.getPofileWithQiSkillsByUserId({ userId, tx });
      if (!profile || !profile.last_qi_update) return null;

      const now = new Date().setSeconds(0);
      const last = profile.last_qi_update.setSeconds(0);
      const { new_last_action_date, past_intervals } = getPastedIntervals({
        now_ms: now,
        last_action_ms: last,
        interval_ms: QI_REGEN_INTERVAL,
      });
      if (past_intervals <= 0) return profile.qi;
      const gainPerInterval = getQiRegenPerInterval({
        qi_param: profile.qi_param,
        power: profile.power,
        protection: profile.protection,
        speed: profile.speed,
        skill: profile.skill,
        lvl: profile.lvl,
        circulation_of_life: profile.user.qi_skills?.circulation_of_life || 0,
        interval: QI_REGEN_INTERVAL,
      });
      const newQi = Math.floor(profile.qi + gainPerInterval * past_intervals);
      await profileRepository.updateQi({
        userId: userId,
        current_qi: newQi,
        last_qi_update: new_last_action_date,
        tx: tx,
      });

      return newQi;
    } catch (err) {
      console.error("recalcQi error:", err);
      return null;
    }
  }

  async CheckUpdateLvl({ userId, tx }: { userId: string; tx?: TransactionType }) {
    try {
      const profile = await this.profileRepo.getByUserId({ userId, tx });
      if (!profile) throw new Error("User profile not found");

      const { exp, lvl } = profile;
      let newLvl = lvl;

      while (lvl_exp[newLvl + 1] !== undefined && exp >= lvl_exp[newLvl + 1]) {
        newLvl += 1;
      }

      if (newLvl !== lvl) {
        const updatedProfile = await this.profileRepo.updateLvl({ userId, lvl: newLvl, tx });
        if (!updatedProfile) throw new Error("Failed to update level");
      }

      return newLvl;
    } catch (error) {
      console.error("update lvl error", error);
      throw new Error("update lvl error");
    }
  }
}

export const profileService = new ProfileService();
