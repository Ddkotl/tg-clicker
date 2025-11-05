export async function HpRegen(userId: string) {
  try {
    const profile = await dataBase.profile.findUnique({
      where: { userId },
    });
    if (!profile) return;

    const now = Date.now();
    const lastUpdate = profile.last_hp_update?.getTime() || now;

    if (profile.current_hitpoint < profile.max_hitpoint) {
      // Сколько «тиков» прошло
      const intervalsPassed = Math.floor((now - lastUpdate) / HP_REGEN_INTERVAL);
      if (intervalsPassed <= 0) return;

      const regenAmount = Math.floor(profile.max_hitpoint * HP_REGEN_PERCENT * intervalsPassed);
      const newHP = Math.min(profile.max_hitpoint, profile.current_hitpoint + regenAmount);

      await dataBase.profile.update({
        where: { userId },
        data: {
          current_hitpoint: newHP,
          last_hp_update: new Date(lastUpdate + intervalsPassed * HP_REGEN_INTERVAL),
        },
      });
    }
  } catch (error) {
    console.error("Health regeneration error :", error);
  }
}
