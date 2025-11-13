import { ProfileRepository } from "@/entities/profile/_repositories/profile_repository";
import { profileRepository } from "@/entities/profile/index.server";
import { FIGHT_CHARGE_REGEN_INTERVAL, FIGHT_COOLDOWN, MAX_CHARGES } from "@/shared/game_config/fight/fight_const";

export class FightService {
  constructor(private profileRepo: ProfileRepository) {}

  async restoreFightCharges(userId: string) {
    let profile = await this.profileRepo.getByUserId(userId);
    if (!profile) return null;

    const now = new Date();
    const lastRecovery = profile.last_charge_recovery ?? now;
    const diff_time = now.getTime() - lastRecovery.getTime();

    if (diff_time < FIGHT_CHARGE_REGEN_INTERVAL) return profile;

    const chargesToAdd = Math.floor(diff_time / FIGHT_CHARGE_REGEN_INTERVAL);
    const newCharges = Math.min(MAX_CHARGES, profile.fight_charges + chargesToAdd);
    const newLastChargeRecovery = new Date(lastRecovery.getTime() + chargesToAdd * FIGHT_CHARGE_REGEN_INTERVAL);

    if (newCharges > profile.fight_charges) {
      profile = await this.profileRepo.updateFightCharges(userId, newCharges, newLastChargeRecovery);
    }

    return profile;
  }

  async canFight(userId: string) {
    const profile = await this.restoreFightCharges(userId);
    if (!profile) return { ok: false, reason: "profile_not_found" };

    const now = new Date();

    if (profile.last_fight_time) {
      const diff = now.getTime() - profile.last_fight_time.getTime();
      if (diff < FIGHT_COOLDOWN) {
        const nextFightTime = new Date(profile.last_fight_time.getTime() + FIGHT_COOLDOWN);
        return { ok: false, reason: "cooldown", nextFightTime };
      }
    }

    if (profile.fight_charges <= 0) {
      return { ok: false, reason: "no_charges", nextChargeInMin: FIGHT_CHARGE_REGEN_INTERVAL };
    }

    return { ok: true, profile };
  }

  async startFight(userId: string) {
    const check = await this.canFight(userId);
    if (!check.ok) return check;

    await this.profileRepo.spendFightCharge(userId);

    return { ok: true };
  }
}

export const fightService = new FightService(profileRepository);
