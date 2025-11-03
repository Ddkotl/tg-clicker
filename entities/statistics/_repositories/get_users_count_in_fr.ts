import { Fraktion } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function getUserCountsInFractions() {
  try {
    const adepts_count = await dataBase.profile.count({
      where: {
        fraktion: Fraktion.ADEPT,
      },
    });
    const novices_count = await dataBase.profile.count({
      where: {
        fraktion: Fraktion.NOVICE,
      },
    });
    return {
      adepts_count: adepts_count,
      novices_count: novices_count,
    };
  } catch (error) {
    console.error("not found users", error);
    return null;
  }
}
