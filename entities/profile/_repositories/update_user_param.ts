import { dataBase } from "@/shared/connect/db_connect";
import { calcMaxHP } from "@/shared/game_config/params/calc_max_xp";
import { calcParamCost } from "@/shared/game_config/params/params_cost";

export type ParamNameType = "power" | "protection" | "speed" | "skill" | "qi_param";

export async function updateUserParam(userId: string, paramName: ParamNameType) {
  try {
    const user = await dataBase.user.findUnique({
      where: { id: userId },
      select: { profile: true },
    });

    if (!user || !user.profile) {
      throw new Error("User or profile not found");
    }

    const currentValue = user.profile[paramName];
    const updateCost = calcParamCost(paramName, currentValue);

    if (user.profile.qi < updateCost) {
      throw new Error("Not enough qi");
    }
    const new_max_hitpoints = calcMaxHP({
      power: user.profile.power,
      protection: user.profile.protection,
      speed: user.profile.speed,
      skill: user.profile.skill,
      qi_param: user.profile.qi_param,
      level: user.profile.lvl,
    });
    const updated_user = await dataBase.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            [paramName]: { increment: 1 },
            qi: { decrement: updateCost },
            max_hitpoint: new_max_hitpoints,
          },
        },
      },
      select: { profile: true },
    });

    return updated_user;
  } catch (error) {
    console.error("Failed to update user param:", error);
    return null;
  }
}

export type UpdateUserParamType = Awaited<ReturnType<typeof updateUserParam>>;
