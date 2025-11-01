import { dataBase } from "@/shared/connect/db_connect";
import { startOfDay } from "date-fns";

export async function hasTodayMissions(userId: string): Promise<boolean> {
  const today = startOfDay(new Date());

  const existingMissions = await dataBase.mission.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  return !!existingMissions;
}
