import z from "zod";

export const userCountInFrResponseSchema = z.object({
  data: z.object({
    adepts: z.number(),
    novices: z.number(),
  }),
  message: z.string(),
});

export const userCountInFrErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});
