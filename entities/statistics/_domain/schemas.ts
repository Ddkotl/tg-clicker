import z from "zod";

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
const RatingOverallSchema = z.object({
  lvl: z.number(),
  exp: z.number(),
  user: UserSchema,
});
const RatingMeditationSchema = z.object({
  meditated_hours: z.number(),
  user: UserSchema,
});
const RatingSpiritSchema = z.object({
  spirit_path_minutes: z.number(),
  user: UserSchema,
});
const RatingMiningSchema = z.object({
  mined_qi_stone: z.number(),
  user: UserSchema,
});
const RatingWinsSchema = z.object({
  fights_wins: z.number(),
  user: UserSchema,
});
export const RatingUnionSchema = z.union([
  z.array(RatingOverallSchema),
  z.array(RatingMeditationSchema),
  z.array(RatingSpiritSchema),
  z.array(RatingMiningSchema),
  z.array(RatingWinsSchema),
]);
export const ratingsOverallResponseSchema = z.object({
  data: RatingUnionSchema,
  message: z.string(),
  ok: z.boolean(),
});
