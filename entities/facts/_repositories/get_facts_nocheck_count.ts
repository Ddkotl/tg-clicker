import { dataBase } from "@/shared/connect/db_connect";
export async function getFactNocheckCount(userId: string) {
  try {
    const count = await dataBase.facts.count({
      where: { userId: userId, status: "NO_CHECKED" },
    });
    return count;
  } catch (error) {
    console.error("getFactsCount error", error);
    return null;
  }
}
