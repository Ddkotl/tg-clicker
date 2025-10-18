import { dataBase } from "@/shared/connect/db_connect";

export async function getUserFacts(userId: string) {
  try {
    const facts = await dataBase.facts.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return facts;
  } catch (error) {
    console.error("getUserFacts error", error);
    return null;
  }
}
