import z from "zod";

const spiritPathInfoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  on_spirit_paths: z.boolean(),
  start_spirit_paths: z.date().nullable(),
  spirit_paths_minutes: z.number().nullable(),
  spirit_paths_reward: z.number().nullable(),
  minutes_today: z.number(),
  date_today: z.date().nullable(),
});
export const spiritPathInfoResponseSchema = z.object({
  data: spiritPathInfoSchema.nullable(),
  message: z.string(),
  type: z.literal("success"),
});

export const goSpiritPathRequestSchema = z.object({
  userId: z.string(),
  minutes: z.number(),
});

export const goSpiritPathResponseSchema = z.object({
  data: spiritPathInfoSchema,
  message: z.string(),
  type: z.literal("success"),
});

export const spiritPathFormSchema = z.object({
  time: z.enum(["10", "20", "30", "60", "120", "180", "240", "300", "360", "420", "480"]),
});
export const spititPathTimeOptions = spiritPathFormSchema.shape.time.options;
export const getSpiritPathRewardRequestSchema = z.object({
  userId: z.string(),
  break_spirit_path: z.boolean().optional(),
});

export const getSpiritPathRewardResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    reward_qi: z.number(),
    reward_exp: z.number(),
    reward_spirit_cristal: z.number(),
    minutes: z.number(),
    current_qi: z.number(),
    current_exp: z.number(),
    current_spirit_cristal: z.number(),
    current_lvl: z.number(),
  }),
  message: z.string(),
  type: z.literal("success"),
});
