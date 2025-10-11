import z from "zod";

const MeditationInfoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  on_meditation: z.boolean(),
  start_meditation: z.date().nullable(),
  meditation_hours: z.number().nullable(),
});
export const meditationInfoResponseSchema = z.object({
  data: MeditationInfoSchema.nullable(),
  message: z.string(),
});

export const meditationInfoErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export const goMeditationRequestSchema = z.object({
  userId: z.string(),
  hours: z.number(),
});

export const goMeditationResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    on_meditation: z.boolean(),
    start_meditation: z.date().nullable(),
    meditation_hours: z.number().nullable(),
  }),
  message: z.string(),
});

export const goMeditationErrorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export const MeditatonFormSchema = z.object({
  time: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
});
