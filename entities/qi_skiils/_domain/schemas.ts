import { QiSkillList } from "@/shared/game_config/qi_skills/qi_skills";
import z from "zod";

const userQiSkillsSchema = z.object({
  userId: z.string(),
  id: z.string(),
  qi_veil: z.number(),
  seal_of_mind: z.number(),
  circulation_of_life: z.number(),
  spatial_vault: z.number(),
});

export const getUserQiSkillsResponseSchema = z.object({
  data: userQiSkillsSchema,
  message: z.string(),
  type: z.literal("success"),
});

export const updateUserQiSkillRequestSchema = z.object({
  skill: z.enum(QiSkillList),
});
export const updateUserQiSkillsResponseSchema = z.object({
  data: z.object({
    skills: userQiSkillsSchema,
    spirit_cristal: z.number(),
  }),
  message: z.string(),
  type: z.literal("success"),
});
