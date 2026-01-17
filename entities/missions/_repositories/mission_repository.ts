import { MissionTime, MissionType } from "@/_generated/prisma/enums";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { DailyMission } from "@/shared/game_config/missions/generate_daily_missions";
import { getStartOfToday } from "@/shared/lib/date";

export class MissionRepository {
  async getMissionById({ missionId, tx }: { missionId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const mission = await db_client.mission.findUnique({
        where: { id: missionId },
      });
      return mission;
    } catch (error) {
      console.error("❌ getMissionById error:", error);
      return null;
    }
  }

  async hasTodayMissions({ userId, tx }: { userId: string; tx?: TransactionType }): Promise<boolean> {
    const db_client = tx ? tx : dataBase;
    try {
      const today = getStartOfToday();

      const existingMissions = await db_client.mission.findFirst({
        where: {
          userId,
          createdAt: {
            gte: today,
          },
          time: MissionTime.DAILY,
        },
      });
      return !!existingMissions;
    } catch (error) {
      console.error("❌ hasTodayMissions error:", error);
      return false;
    }
  }
  async deleteOldMissions({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const today = getStartOfToday();

      const deleted = await db_client.mission.deleteMany({
        where: {
          userId,
          createdAt: { lt: today },
          time: MissionTime.DAILY,
        },
      });

      return deleted.count;
    } catch (error) {
      console.error("❌ deleteOldMissions error:", error);
      return 0;
    }
  }
  async createMissions({
    daily_missions,
    userId,
    tx,
  }: {
    daily_missions: DailyMission[];
    userId: string;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      return await db_client.mission.createMany({
        data: daily_missions.map((m) => ({ ...m, userId })),
      });
    } catch (error) {
      console.error("❌ createMissions error:", error);
      return null;
    }
  }
  async getUserDailyMissions({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const missions = await db_client.mission.findMany({
        where: { userId, is_completed: false },
        orderBy: { createdAt: "desc" },
      });

      return missions;
    } catch (error) {
      console.error("❌ getUserMissions error:", error);
      return null;
    }
  }
  async InactivateMission({ mission_id, tx }: { mission_id: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const mission = await db_client.mission.update({
        where: { id: mission_id },
        data: {
          is_active: false,
        },
      });
      return mission;
    } catch (error) {
      console.log("InactivateMission error", error);
      return null;
    }
  }
  async UpdateProgressMission({
    mission_type,
    progress,
    userId,
    chanel_id,
    tx,
  }: {
    userId: string;
    mission_type: MissionType;
    progress: number;
    chanel_id?: string;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      let updated_mission = await db_client.mission.update({
        where: { user_type_chanel_unique: { userId: userId, type: mission_type, chanel_id: chanel_id || "-" } },
        data: {
          progress: { increment: progress },
        },
      });

      if (updated_mission.progress >= updated_mission.target_value) {
        updated_mission = await db_client.mission.update({
          where: { user_type_chanel_unique: { userId: userId, type: mission_type, chanel_id: chanel_id || "-" } },
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
  async UpdateProgressMissionByMissionId({
    missionId,
    progress,
    tx,
  }: {
    missionId: string;
    progress: number;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      let updated_mission = await db_client.mission.update({
        where: { id: missionId },
        data: {
          progress: { increment: progress },
        },
      });

      if (updated_mission.progress >= updated_mission.target_value) {
        updated_mission = await db_client.mission.update({
          where: { id: missionId },
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
}

export const missionRepository = new MissionRepository();
