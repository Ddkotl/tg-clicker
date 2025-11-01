import { dataBase } from "@/shared/connect/db_connect";

export async function getUserDailyMissions(userId: string) {
  try {
    const missions = await dataBase.mission.findMany({
      where: { userId, is_completed: false },
      orderBy: { createdAt: "desc" },
    });

    return missions;
  } catch (error) {
    console.error("❌ getUserMissions error:", error);
    return null;
  }
}
