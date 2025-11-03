import { dataBase } from "@/shared/connect/db_connect";
import { HP_REGEN_INTERVAL, HP_REGEN_PERCENT } from "@/shared/game_config/params/hp_regen";

export async function recalcHp(userId: string) {
  try {
    const profile = await dataBase.profile.findUnique({
      where: { userId },
      select: {
        current_hitpoint: true,
        max_hitpoint: true,
        last_hp_update: true,
      },
    });
    if (!profile) return null;

    const now = new Date().getTime();
    const last = profile.last_hp_update.getTime();

    const intervalsPassed = Math.floor((now - last) / HP_REGEN_INTERVAL);
    if (intervalsPassed <= 0) return profile.current_hitpoint;

    const regenAmount = Math.ceil(profile.max_hitpoint * HP_REGEN_PERCENT * intervalsPassed);
    const newHp = Math.min(profile.current_hitpoint + regenAmount, profile.max_hitpoint);
    const newLastUpdate = new Date(last + intervalsPassed * HP_REGEN_INTERVAL);
    await dataBase.profile.update({
      where: { userId },
      data: {
        current_hitpoint: newHp,
        last_hp_update: newLastUpdate,
      },
    });

    return newHp;
  } catch (err) {
    console.error("recalcHp error:", err);
    return null;
  }
}
