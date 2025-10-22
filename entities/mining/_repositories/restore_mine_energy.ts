import { dataBase } from "@/shared/connect/db_connect";

export async function RestoreMineEnergy(userId: string, new_last_energy_at: Date, new_energy?: number) {
  try {
    const updated_user_mine = await dataBase.mine.update({
      where: { userId: userId },
      data: {
        last_energy_at: new_last_energy_at,
        energy: new_energy,
      },
    });
    return updated_user_mine;
  } catch (error) {
    console.error("RestoreMineEnergy error", error);
    return null;
  }
}
