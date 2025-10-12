import { dataBase } from "@/shared/connect/db_connect";

export async function getMeditationInfo(userId: string) {
  try {
    return await dataBase.meditation.findUnique({
      where: {
        userId: userId,
      },
    });
  } catch (error) {
    console.error("getMeditationInfo error", error);
    return null;
  }
}
