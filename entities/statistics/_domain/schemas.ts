import z from "zod";
import { ratingMetrics, ratingsTypes } from "./types";

export const userCountInFrResponseSchema = z.object({
  data: z.object({
    adepts: z.number(),
    novices: z.number(),
  }),
  message: z.string(),
});

const ProfileSchema = z.object({
  nikname: z.string().nullable(),
  avatar_url: z.string().nullable(),
});

const UserSchema = z.object({
  id: z.string(),
  profile: ProfileSchema.nullable(),
});

export const RatingUnionSchema = z.object({
  rating_metric: z.enum(Object.values(ratingMetrics)),
  rating_type: z.enum(Object.values(ratingsTypes)),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  pages: z.number(),
  data: z.array(
    z.object({
      amount: z.number(),
      user: UserSchema.nullable(),
    }),
  ),
});
export const ratingsResponseSchema = z.object({
  data: RatingUnionSchema,
  message: z.string(),
  ok: z.boolean(),
});

export const UserStatsTypeSchema = z.enum(["overall", "daily", "weekly", "monthly"]);

export const UserStatsRequestParamsSchema = z.object({
  type: UserStatsTypeSchema,
  userId: z.string().min(1),
});

export const UserStatItemSchema = z.object({
  exp: z.number().nullable(),
  meditated_hours: z.number().nullable(),
  spirit_path_minutes: z.number().nullable(),
  mined_qi_stone: z.number().nullable(),
  mined_count: z.number().nullable(),
  fights_total: z.number().nullable(),
  fights_wins: z.number().nullable(),

  qi_looted: z.number().nullable(),
  qi_lost: z.number().nullable(),
  qi_stone_looted: z.number().nullable(),
  qi_stone_lost: z.number().nullable(),

  missions: z.number().nullable(),
});

export const UserStatsResponseDataSchema = z.object({
  userId: z.string(),
  type: UserStatsTypeSchema,
  stats: UserStatItemSchema.nullable(),
});

export const UserStatsResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string(),
  data: UserStatsResponseDataSchema,
});
