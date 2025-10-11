import z from "zod";
import {
  meditationInfoErrorResponseSchema,
  goMeditationErrorResponseSchema,
  goMeditationRequestSchema,
  goMeditationResponseSchema,
  meditationInfoResponseSchema,
  MeditatonFormSchema,
} from "./schemas";

export type MeditationInfoResponse = z.infer<
  typeof meditationInfoResponseSchema
>;
export type MeditationInfoErrorResponse = z.infer<
  typeof meditationInfoErrorResponseSchema
>;

export type goMeditationResponseType = z.infer<
  typeof goMeditationResponseSchema
>;
export type goMeditationErrorResponseType = z.infer<
  typeof goMeditationErrorResponseSchema
>;
export type goMeditationRequestType = z.infer<typeof goMeditationRequestSchema>;
export type MeditatonFormType = z.infer<typeof MeditatonFormSchema>;
