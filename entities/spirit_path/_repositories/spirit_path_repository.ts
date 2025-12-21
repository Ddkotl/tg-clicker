import { SpiritPath } from "@/_generated/prisma/client";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";

export class SpiritPathRepository {
  async getSpiritPathInfo({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const spirit_path = await db_client.spiritPath.findUnique({
        where: {
          userId: userId,
        },
      });

      return spirit_path;
    } catch (error) {
      console.error("getSpiritPathInfo error", error);
      return null;
    }
  }

  async startSpiritPath({
    userId,
    minutes,
    spirit_path_reward,
    tx,
    sameDay,
  }: {
    userId: string;
    minutes: number;
    spirit_path_reward: number;
    sameDay: boolean;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      return await db_client.spiritPath.update({
        where: { userId },
        data: {
          spirit_paths_minutes: minutes,
          on_spirit_paths: true,
          start_spirit_paths: new Date(),
          spirit_paths_reward: spirit_path_reward,
          date_today: new Date(),
          minutes_today: sameDay ? { increment: minutes } : minutes,
        },
      });
    } catch (e) {
      console.error("startSpiritPathError", e);
    }
  }
  async endSpiritPAth({ userId, data, tx }: { userId: string; data: Partial<SpiritPath>; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      const updated_spirit_path = await db_client.spiritPath.update({
        where: { userId: userId },
        data: data,
      });
      return updated_spirit_path;
    } catch (error) {
      console.error("endSpiritPath error", error);
    }
  }
}

export const spiritPathRepository = new SpiritPathRepository();
