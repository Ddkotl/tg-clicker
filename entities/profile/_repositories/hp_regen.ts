import { dataBase } from "@/shared/connect/db_connect";

export async function HpRegen(userId: string) {
  try {
    const profile = await dataBase.profile.findUnique({ where: { userId } });
    if (!profile) return;

    if (profile.current_hitpoint < profile.max_hitpoint) {
      const newHp = Math.min(
        profile.max_hitpoint,
        profile.current_hitpoint + profile.max_hitpoint * 0.1,
      );
      await dataBase.profile.update({
        where: { userId },
        data: { current_hitpoint: newHp },
      });
    }
  } catch (error) {
    console.error("Health regeneration error:", error);
  }
}
