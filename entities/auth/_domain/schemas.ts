import { Fraktion, Gender } from "@/_generated/prisma";
import z from "zod";

export const authRequestSchema = z.object({
  initData: z.string(),
  ref: z.string().optional(),
});

export const authResponseSchema = z.object({
  data: z.object({
    language_code: z.string().optional(),
    nikname: z.string().optional(),
    color_theme: z.string().optional(),
  }),
  message: z.string(),
});

export const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export const sessionResponseSchema = z.object({
  data: z.object({
    user: z.object({
      telegram_id: z.string(),
      userId: z.string(),
    }),
    exp: z.number(),
  }),
  message: z.string(),
});

export const errorSessionResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export const checkNicknameRequestSchema = z.object({
  nickname: z
    .string()
    .min(3, "Nickname must be at least 3 characters long")
    .max(20, "Nickname must be at most 20 characters long")
    .regex(/^[а-яА-Яa-zA-Z0-9_]+$/, "Nickname can only contain letters, numbers, and underscores"),
});

export const checkNicknameResponseSchema = z.object({
  data: z.object({
    available: z.boolean(),
  }),
  message: z.string(),
});

export const checkNicknameerrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export const registrationRequestSchema = z.object({
  userId: z.string(),
  nikname: z.string().min(3),
  fraktion: z.enum(Fraktion),
  gender: z.enum(Gender),
  color_theme: z.string(),
  avatar_url: z.string().optional(),
});

export const registrationResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    nikname: z.string().nullable(),
    fraktion: z.enum(Fraktion).nullable(),
    gender: z.enum(Gender).nullable(),
    color_theme: z.string().nullable(),
    avatar_url: z.string().nullable(),
  }),
  message: z.string(),
});

export const registrationErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});
