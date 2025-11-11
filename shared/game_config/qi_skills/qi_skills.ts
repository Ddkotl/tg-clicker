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
  qi_veil: {
    maxLevel: 5,
    calcUpgradeCost: (lvl: number) => (lvl + 1) * 100,
    effects: (lvl: number) => lvl * 3,
  },
  seal_of_mind: {
    maxLevel: 5,
    calcUpgradeCost: (lvl: number) => (lvl + 1) * 150,
    effects: (lvl: number) => lvl * 4,
  },
  circulation_of_life: {
    maxLevel: 5,
    calcUpgradeCost: (lvl: number) => (lvl + 1) * 200,
    effects: (lvl: number) => lvl,
  },
  spatial_vault: {
    maxLevel: 10,
    calcUpgradeCost: (lvl: number) => (lvl + 1) * 300,
    effects: (lvl: number) => 100 + lvl * 30,
  },
} satisfies Record<
  QiSkillKey,
  { maxLevel: number; calcUpgradeCost: (lvl: number) => number; effects: (lvl: number) => number }
>;
