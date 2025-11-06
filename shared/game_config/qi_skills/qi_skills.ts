import { UserQiSkills } from "@/_generated/prisma";

type QiSkillTableKey = keyof UserQiSkills;
export type QiSkillKey = Exclude<QiSkillTableKey, "id" | "userId">;

export const QiSkillList = [
  "qi_veil",
  "seal_of_mind",
  "circulation_of_life",
  "spatial_vault",
] as const satisfies readonly QiSkillKey[];

export const QiSkillsConfig = {
  qi_veil: { maxLevel: 5, calcUpgradeCost: (lvl: number) => (lvl + 1) * 100 },
  seal_of_mind: { maxLevel: 5, calcUpgradeCost: (lvl: number) => (lvl + 1) * 150 },
  circulation_of_life: { maxLevel: 5, calcUpgradeCost: (lvl: number) => (lvl + 1) * 200 },
  spatial_vault: { maxLevel: 3, calcUpgradeCost: (lvl: number) => (lvl + 1) * 300 },
} satisfies Record<QiSkillKey, { maxLevel: number; calcUpgradeCost: (lvl: number) => number }>;
