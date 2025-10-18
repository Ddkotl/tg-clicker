import { FactsStatus, FactsType } from "@/_generated/prisma";
import z from "zod";

export const factSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(FactsType),
  status: z.enum(FactsStatus),
  mana_reward: z.number().nullable(),
  exp_reward: z.number().nullable(),
  active_hours: z.number().nullable(),
  createdAt: z.date(),
});
export const factResponseSchema = z.object({
  data: z.array(factSchema),
  message: z.string(),
});

export const factErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});
