import { dataBase } from "@/shared/connect/db_connect";

type ResourceOperation = {
  add?: number;
  remove?: number;
};

interface ResourceUpdateParams {
  userId: string;
  resources: Partial<Record<"exp" | "qi" | "qi_stone" | "spirit_cristal" | "glory", number | ResourceOperation>>;
}

export async function UpdateResources({ userId, resources }: ResourceUpdateParams) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {};

    for (const [key, value] of Object.entries(resources)) {
      if (typeof value === "number") {
        // number -> increment или decrement по знаку
        data[key] = { increment: value };
      } else if (typeof value === "object" && value !== null) {
        if (value.add !== undefined) data[key] = { increment: value.add };
        if (value.remove !== undefined) data[key] = { decrement: value.remove };
      }
    }

    if (Object.keys(data).length === 0) return null;

    return await dataBase.profile.update({
      where: { userId },
      data,
    });
  } catch (error) {
    console.error("UpdateResources error:", error);
    return null;
  }
}
