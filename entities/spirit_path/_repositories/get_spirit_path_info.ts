import { dataBase } from "@/shared/connect/db_connect";

export async function getSpiritPathInfo(userId: string) {
  try {
    return await dataBase.spiritPath.findUnique({
      where: {
        userId: userId,
      },
    });
  } catch (error) {
    console.error("getSpiritPathInfo error", error);
    return null;
  }
}
