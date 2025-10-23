import { dataBase } from "@/shared/connect/db_connect";

export async function GetUserMine(userId: string) {
  try {
    const user_mine = await dataBase.mine.findUnique({
      where: {
        userId: userId,
      },
    });
    return user_mine;
  } catch (error) {
    console.error("GetUserMine error", error);
    return null;
  }
}
