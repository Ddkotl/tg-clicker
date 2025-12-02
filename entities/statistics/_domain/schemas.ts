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
