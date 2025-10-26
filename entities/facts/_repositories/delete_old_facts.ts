import { dataBase } from "@/shared/connect/db_connect";

export async function deleteOldFacts(userId: string) {
  try {
    const deleted = await dataBase.facts.deleteMany({
      where: {
        userId: userId,
        createdAt: {
          lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      },
    });
    return deleted.count;
  } catch (error) {
    console.error("deleteOldFacts error", error);
    return null;
  }
}
