import { dataBase } from "@/shared/connect/db_connect";
export async function getUserFacts(userId: string, page: number, page_size: number) {
  const skip = (page - 1) * page_size;
  const take = page_size;
  try {
    const facts = await dataBase.facts.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
    const total = await dataBase.facts.count({
      where: { userId },
    });
    const hasNextPage = skip + take < total;
    return {
      facts: facts,
      hasNextPage: hasNextPage,
    };
  } catch (error) {
    console.error("getUserFacts error", error);
    return null;
  }
}
