import { dataBase } from "@/shared/connect/db_connect";
import { QiSkillKey } from "@/shared/game_config/qi_skills/qi_skills";

export async function UpdateQiSkill({ userId, skill }: { userId: string; skill: QiSkillKey }) {
  try {
    const skills = await dataBase.userQiSkills.update({
      where: { userId: userId },
      data: { [skill]: { increment: 1 } },
    });
    return skills;
  } catch (error) {
    console.log("UpdateQiSkill error", error);
    return null;
  }
}
