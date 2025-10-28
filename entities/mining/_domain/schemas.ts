import z from "zod";

export const miningRequestSchema = z.object({
  userId: z.string(),
});

export const miningResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    lvl: z.number(),
    qi_stone_reward: z.number(),
    exp_reward: z.number(),
    energy: z.number(),
    last_mine_at: z.number().nullable(),
    last_energy_at: z.number().nullable(),
  }),
  message: z.string(),
  type: z.literal("ok"),
});
export const getMineResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    energy: z.number(),
    last_energy_at: z.number(),
    last_mine_at: z.number(),
  }),
  message: z.string(),
  type: z.literal("ok"),
});
