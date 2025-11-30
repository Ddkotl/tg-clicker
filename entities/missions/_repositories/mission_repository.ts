import { MissionType } from "@/_generated/prisma";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { DailyMission } from "@/shared/game_config/missions/generate_daily_missions";
import { getStartOfToday } from "@/shared/lib/date";

export class MissionRepository {
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
  async InactivateMission({
    mission_type,
    userId,
    tx,
  }: {
    userId: string;
    mission_type: MissionType;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      await db_client.mission.update({
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
  async UpdateProgressMission({
    mission_type,
    progress,
    userId,
    tx,
  }: {
    userId: string;
    mission_type: MissionType;
    progress: number;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      let updated_mission = await db_client.mission.update({
        where: { userId_type: { userId: userId, type: mission_type } },
        data: {
          progress: { increment: progress },
        },
      });

      if (updated_mission.progress >= updated_mission.target_value) {
        updated_mission = await db_client.mission.update({
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
}

export const missionRepository = new MissionRepository();
