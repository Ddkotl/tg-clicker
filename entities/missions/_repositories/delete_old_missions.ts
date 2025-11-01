// ✅ deleteOldMissions.ts
import { dataBase } from "@/shared/connect/db_connect";
import { startOfDay } from "date-fns";

export async function deleteOldMissions(userId: string) {
  try {
    const today = startOfDay(new Date());

    const deleted = await dataBase.mission.deleteMany({
      where: {
        userId,
        createdAt: { lt: today },
      },
    });

    if (deleted.count > 0) {
      console.log(`🗑️ Удалено ${deleted.count} старых миссий для пользователя ${userId}`);
    }

    return deleted.count;
  } catch (error) {
    console.error("❌ deleteOldMissions error:", error);
    return 0;
  }
}
