import { dataBase } from "@/shared/connect/db_connect";

export async function checkUserDeals(userId: string): Promise<"ok" | string | null> {
  try {
    const user = await dataBase.user.findUnique({
      where: { id: userId },
      select: {
        meditation: { select: { on_meditation: true } },
      },
    });

    if (!user) return "User not found";
    if (user.meditation?.on_meditation) return "User is on meditation";
    return "ok";
  } catch (error) {
    console.error("Error checkUserDeals:", error);
    return null;
  }
}
