import z from "zod";
import { MissionType } from "@/_generated/prisma";

export const DailyMissionSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  type: z.enum(MissionType),
  reward_exp: z.number(),
  reward_qi: z.number(),
  reward_qi_stone: z.number(),
  reward_spirit_cristal: z.number(),
  reward_glory: z.number(),
  target_value: z.number(),
  progress: z.number(),
  is_active: z.boolean(),
  is_completed: z.boolean(),
});

export const getDailyMissionsRequestSchema = z.object({
  userId: z.string(),
});

export const getDailyMissionsResponseSchema = z.object({
  data: z.object({
    missions: z.array(DailyMissionSchema),
  }),
  message: z.string(),
  type: z.literal("success"),
});
export const createDailyMissionsResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
  }),
  message: z.string(),
  type: z.literal("success"),
});
