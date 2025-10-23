import { dataBase } from "@/shared/connect/db_connect";

export async function CreateUserMine(userId: string, now: Date) {
  try {
    const new_user_mine = await dataBase.mine.create({
      data: {
        userId: userId,
        last_energy_at: now,
      },
    });
    return new_user_mine;
  } catch (error) {
    console.error("CreateUserMine error", error);
    return null;
  }
}
