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
  qi: z.number(),
  qi_stone: z.number(),
  spirit_cristal: z.number(),
  fight: z.number(),
  last_fight_time: z.date().nullable(),
  glory: z.number(),
  power: z.number(),
  protection: z.number(),
  speed: z.number(),
  skill: z.number(),
  qi_param: z.number(),
  current_hitpoint: z.number(),
  max_hitpoint: z.number(),
  last_hp_update: z.date(),
});
export const profileResponseSchema = z.object({
  data: ProfileSchema.nullable(),
  message: z.string(),
});

export const profileErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export const trainSchema = z.object({
  paramName: z.enum(["power", "protection", "speed", "skill", "qi_param"]),
});

export const trainResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    paramName: trainSchema.shape.paramName,
    newValue: z.number(),
    qi: z.number(),
    max_hitpoint: z.number(),
  }),
  message: z.string(),
});

export const trainErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});
