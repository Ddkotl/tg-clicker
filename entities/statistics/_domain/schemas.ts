import z from "zod";
import { OverallRatingsMAP_KEYS } from "./ratings_list_items";

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
const RatingExpSchema = z.object({
  rating_type: z.literal(OverallRatingsMAP_KEYS.exp),
  data: z.array(
    z.object({
      lvl: z.number(),
      exp: z.number(),
      user: UserSchema,
    }),
  ),
});
const RatingMeditationSchema = z.object({
  rating_type: z.literal(OverallRatingsMAP_KEYS.meditation),
  data: z.array(
    z.object({
      meditated_hours: z.number(),
      user: UserSchema,
    }),
  ),
});
const RatingSpiritSchema = z.object({
  rating_type: z.literal(OverallRatingsMAP_KEYS.spirit),
  data: z.array(
    z.object({
      spirit_path_minutes: z.number(),
      user: UserSchema,
    }),
  ),
});
const RatingMiningSchema = z.object({
  rating_type: z.literal(OverallRatingsMAP_KEYS.mining),
  data: z.array(
    z.object({
      mined_qi_stone: z.number(),
      user: UserSchema,
    }),
  ),
});
const RatingWinsSchema = z.object({
  rating_type: z.literal(OverallRatingsMAP_KEYS.wins),
  data: z.array(
    z.object({
      fights_wins: z.number(),
      user: UserSchema,
    }),
  ),
});
export const RatingUnionSchema = z.discriminatedUnion("rating_type", [
  RatingExpSchema,
  RatingMeditationSchema,
  RatingSpiritSchema,
  RatingMiningSchema,
  RatingWinsSchema,
]);
export const ratingsOverallResponseSchema = z.object({
  data: RatingUnionSchema,
  message: z.string(),
  ok: z.boolean(),
});
