import { calcParamCost } from "@/config/params_cost";
import { dataBase } from "@/utils/db_connect";

export async function updateUserParam(userId: string, paramName: string) {
  try {
    const user = await dataBase.user.findUnique({
      where: { id: userId },
      select: {
        profile: true,
      },
    });
    if (!user || !user.profile?.power) throw new Error("User not found");
    const updateCost = calcParamCost(paramName, user.profile.power);
    if (user.profile.mana < updateCost) {
      throw new Error("Not enough mana");
    }
    const updated_user = await dataBase.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            [paramName]: { increment: 1 },
            mana: { decrement: updateCost },
          },
        },
      },
      select: {
        profile: true,
      },
    });
    return updated_user;
  } catch (error) {
    console.error("Failed to update user param:", error);
    return null;
  }
}

export type updateUserParamType = Awaited<ReturnType<typeof updateUserParam>>;
