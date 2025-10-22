import z from "zod";

export const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
  type: z.literal("err"),
});
