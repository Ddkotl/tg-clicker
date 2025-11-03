import { dataBase } from "@/shared/connect/db_connect";
import dayjs from "dayjs";

export async function getSpiritPathInfo(userId: string) {
  try {
    let spirit_path = await dataBase.spiritPath.findUnique({
      where: {
        userId: userId,
      },
    });
    const today = dayjs().startOf("day").toDate();
    const isSameDay = spirit_path?.date_today ? dayjs(spirit_path?.date_today).isSame(today, "day") : false;

    if (isSameDay) {
      spirit_path = await dataBase.spiritPath.update({
        where: { userId },
        data: {
          date_today: new Date(),
          minutes_today: 0,
        },
      });
    }
    return spirit_path;
  } catch (error) {
    console.error("getSpiritPathInfo error", error);
    return null;
  }
}
