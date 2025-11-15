import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { getQiRegenPerInterval, QI_REGEN_INTERVAL } from "@/shared/game_config/params/qi_regen";

export async function recalcQi({ userId, tx }: { userId: string; tx?: TransactionType }) {
  const db_client = tx ? tx : dataBase;
  try {
    const user = await db_client.user.findUnique({
      where: { id: userId },
      select: {
        profile: {
          select: {
            qi: true,
            qi_param: true,
            power: true,
            protection: true,
            speed: true,
            skill: true,
            lvl: true,
            last_qi_update: true,
          },
        },
        qi_skills: {
          select: { circulation_of_life: true },
        },
      },
    });

    if (!user?.profile || !user?.qi_skills) return null;

    const profile = user.profile;
    const now = new Date();

    // Округляем прошлое обновление до начала минуты
    const lastUpdate = new Date(profile.last_qi_update);
    lastUpdate.setSeconds(0, 0);

    // Округляем текущее время до начала минуты
    const currentTime = new Date(now);
    currentTime.setSeconds(0, 0);

    const diffMs = currentTime.getTime() - lastUpdate.getTime();
    const intervalsPassed = Math.floor(diffMs / QI_REGEN_INTERVAL);

    if (intervalsPassed <= 0) return profile; // нечего регенить

    const gainPerInterval = getQiRegenPerInterval({
      qi_param: profile.qi_param,
      power: profile.power,
      protection: profile.protection,
      speed: profile.speed,
      skill: profile.skill,
      lvl: profile.lvl,
      circulation_of_life: user.qi_skills.circulation_of_life,
      interval: QI_REGEN_INTERVAL,
    });

    const newQi = Math.floor(profile.qi + gainPerInterval * intervalsPassed);

    const updated = await db_client.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            qi: newQi,
            last_qi_update: currentTime,
          },
        },
      },
      select: { profile: true },
    });

    return updated.profile;
  } catch (err) {
    console.error("[updateUserQi] error:", err);
    return null;
  }
}
