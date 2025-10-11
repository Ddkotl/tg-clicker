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
