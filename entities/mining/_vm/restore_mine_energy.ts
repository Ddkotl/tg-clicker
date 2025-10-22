import { Mine } from "@/_generated/prisma";
import { ENERGY_RECHARGE_INTERVAL, MAX_ENERGY } from "@/shared/game_config/mining/mining_const";
import { RestoreMineEnergy } from "../index.server";

export async function restoreEnergy(userId: string, user_mine: Mine, now: Date): Promise<Mine> {
  if (user_mine.last_energy_at) {
    const elapsed = now.getTime() - user_mine.last_energy_at.getTime();
    const restored = Math.floor(elapsed / ENERGY_RECHARGE_INTERVAL);

    if (restored > 0 && user_mine.energy < MAX_ENERGY) {
      const new_energy = Math.min(MAX_ENERGY, user_mine.energy + restored);
      const new_last_energy_at = new Date(user_mine.last_energy_at.getTime() + restored * ENERGY_RECHARGE_INTERVAL);

      const updated = await RestoreMineEnergy(userId, new_last_energy_at, new_energy);
      return updated ?? user_mine;
    }
  } else {
    const updated = await RestoreMineEnergy(userId, now);
    return updated ?? user_mine;
  }

  return user_mine;
}
