import { dataBase } from "@/shared/connect/db_connect";

interface ResourceUpdateParams {
  userId: string;
  exp?: number;
  qi?: number;
  qi_stone?: number;
  spirit_cristal?: number;
  glory?: number;
}

export async function GetResources(params: ResourceUpdateParams) {
  const { userId, exp, qi, qi_stone, spirit_cristal, glory } = params;

  try {
    // динамически формируем объект обновления
    const data: Record<string, object> = {};

    if (exp !== undefined) data.exp = { increment: exp };
    if (qi !== undefined) data.qi = { increment: qi };
    if (qi_stone !== undefined) data.qi_stone = { increment: qi_stone };
    if (spirit_cristal !== undefined) data.spirit_cristal = { increment: spirit_cristal };
    if (glory !== undefined) data.glory = { increment: glory };

    if (Object.keys(data).length === 0) {
      console.warn("⚠️ Нет данных для обновления");
      return null;
    }

    const profile = await dataBase.profile.update({
      where: { userId },
      data,
    });

    return profile;
  } catch (error) {
    console.error("getResources error:", error);
    return null;
  }
}
