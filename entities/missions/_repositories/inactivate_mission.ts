import { MissionType } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function InactivateMission(userId: string, mission_type: MissionType) {
  try {
    await dataBase.mission.update({
      where: { userId_type: { userId: userId, type: mission_type } },
      data: {
        is_active: false,
      },
    });
  } catch (error) {
    console.log("InactivateMission error", error);
    return null;
  }
}
