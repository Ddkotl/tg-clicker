import { MissionType } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function UpdateProgressMission(userId: string, mission_type: MissionType, progress: number) {
  try {
    let updated_mission = await dataBase.mission.update({
      where: { userId_type: { userId: userId, type: mission_type } },
      data: {
        progress: { increment: progress },
      },
    });

    if (updated_mission.progress >= updated_mission.target_value) {
      updated_mission = await dataBase.mission.update({
        where: { userId_type: { userId, type: mission_type } },
        data: {
          is_completed: true,
        },
      });
    }
    return updated_mission;
  } catch (error) {
    console.log("updateptogressMission error", error);
    return null;
  }
}
