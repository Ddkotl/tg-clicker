import { dataBase } from "@/shared/connect/db_connect";

export async function getSpiritPathInfo(userId: string) {
  try {
    const spirit_path = await dataBase.spiritPath.findUnique({
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
