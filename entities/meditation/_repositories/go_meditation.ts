import { dataBase } from "@/shared/connect/db_connect";

export async function goMeditation(
  userId: string,
  hours: number,
  meditation_revard: number,
) {
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
        meditation_revard: meditation_revard,
      },
    });
  } catch (error) {
    console.error("goMeditation error", error);
    return null;
  }
}
