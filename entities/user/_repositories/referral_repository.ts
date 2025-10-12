import { dataBase } from "@/shared/connect/db_connect";

export async function getReferrer(userId: string) {
  try {
    return await dataBase.user.findUnique({
      where: { id: userId },
      select: {
        referrerId: true,
      },
    });
  } catch (e) {
    console.log("Not referrer", e);
    return null;
  }
}

export async function getReferrals(userId: string) {
  try {
    return await dataBase.user.findMany({
      where: { referrerId: userId },
      select: {
        id: true,
      },
    });
  } catch (e) {
    console.log("Not referrals", e);
    return [];
  }
}
