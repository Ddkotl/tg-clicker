import { FactsStatus, FactsType } from "@/_generated/prisma";
import z from "zod";

export const factSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(FactsType),
  status: z.enum(FactsStatus),
  gold_reward: z.number().nullable(),
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

export const checkAllFactsRequestSchema = z.object({
  userId: z.string(),
});

export const checkAllFactsResponseSchema = z.object({
  data: z.object({ userId: z.string() }),
  message: z.string(),
  type: z.literal("success"),
});
export const checkAllFactsErrorResponseSchema = z.object({
  data: z.object({}),
  message: z.string(),
  type: z.literal("error"),
});
