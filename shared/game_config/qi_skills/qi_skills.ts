import { UserQiSkills } from "@/_generated/prisma";

type QiSkillTableKey = keyof UserQiSkills;
export type QiSkillKey = Exclude<QiSkillTableKey, "id" | "userId">;

export const QiSkillsConfig: Record<
  QiSkillKey,
  {
    name: string;
    description: string;
    maxLevel: number;
    calcUpgradeCost: (currentLevel: number) => number;
  }
> = {
  qi_veil: {
    name: "Покров Ци",
    description: "Снижает входящий урон",
    maxLevel: 5,
    calcUpgradeCost: (lvl) => (lvl + 1) * 100,
  },
  seal_of_mind: {
    name: "Печать Умиротворения Духа",
    description: "Даёт шанс обездвижить врага",
    maxLevel: 5,
    calcUpgradeCost: (lvl) => (lvl + 1) * 150,
  },
  circulation_of_life: {
    name: "Циркуляция Жизни",
    description: "Увеличивает регенерацию Ци",
    maxLevel: 5,
    calcUpgradeCost: (lvl) => (lvl + 1) * 200,
  },
  spatial_vault: {
    name: "Пространственное Хранилище",
    description: "Увеличивает вместимость инвентаря",
    maxLevel: 3,
    calcUpgradeCost: (lvl) => (lvl + 1) * 300,
  },
};
