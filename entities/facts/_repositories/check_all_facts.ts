import { FactsStatus } from "@/_generated/prisma";
import { dataBase } from "@/shared/connect/db_connect";

export async function CheckAllFacts(userId: string) {
  try {
    const res = await dataBase.facts.updateMany({
      where: {
        userId: userId,
        status: FactsStatus.NO_CHECKED,
      },
      data: {
        status: FactsStatus.CHECKED,
      },
    });
    return res;
  } catch (error) {
    console.error("CheckAllFacts error", error);
    return null;
  }
}
