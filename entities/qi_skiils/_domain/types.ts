import z from "zod";
import {
  getUserQiSkillsResponseSchema,
  updateUserQiSkillRequestSchema,
  updateUserQiSkillsResponseSchema,
} from "./schemas";

export type GetUserQiSkillsResponseType = z.infer<typeof getUserQiSkillsResponseSchema>;
export type UpdateUserQiSkillRequestType = z.infer<typeof updateUserQiSkillRequestSchema>;
export type UpdateUserQiSkillsResponseType = z.infer<typeof updateUserQiSkillsResponseSchema>;
