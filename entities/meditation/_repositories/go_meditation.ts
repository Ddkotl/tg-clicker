import { dataBase } from "@/shared/utils/db_connect";

export async function goMeditation(userId: string, hours: number) {
  try {
    const meditate = await dataBase.meditation.findUnique({
      where: {
        userId: userId,
      },
    });
    if (meditate?.on_meditation === true) return null;
    return await dataBase.meditation.update({
      where: { userId: userId },
      data: {
        meditation_hours: hours,
        on_meditation: true,
        start_meditation: new Date(),
      },
    });
  } catch (error) {
    console.error("goMeditation error", error);
    return null;
  }
}
