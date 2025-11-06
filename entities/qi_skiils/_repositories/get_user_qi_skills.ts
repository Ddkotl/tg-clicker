import { dataBase } from "@/shared/connect/db_connect";

export async function GetUserQiSkills(userId: string) {
  try {
    const user_skills = await dataBase.userQiSkills.findUnique({
      where: { userId: userId },
    });
    return user_skills;
  } catch (error) {
    console.log("GetUserQiSkills error", error);
    return null;
  }
}
