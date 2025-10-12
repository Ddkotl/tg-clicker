import { Fraktion, Gender } from "@/_generated/prisma";
import z from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fraktion: z.enum(Fraktion).nullable(),
  nikname: z.string().nullable(),
  gender: z.enum(Gender).nullable(),
  color_theme: z.string().nullable(),
  avatar_url: z.string().nullable(),
  player_motto: z.string().nullable(),
  lvl: z.number(),
  exp: z.number(),
  mana: z.number(),
  gold: z.number(),
  diamond: z.number(),
  fight: z.number(),
  last_fight_time: z.date().nullable(),
  glory: z.number(),
  power: z.number(),
  protection: z.number(),
  speed: z.number(),
  skill: z.number(),
  qi: z.number(),
  current_hitpoint: z.number(),
  max_hitpoint: z.number(),
});
export const profileResponseSchema = z.object({
  data: ProfileSchema.nullable(),
  message: z.string(),
});

export const profileErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});
