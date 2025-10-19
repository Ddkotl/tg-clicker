import z from "zod";
import {
  meditationInfoErrorResponseSchema,
  goMeditationErrorResponseSchema,
  goMeditationRequestSchema,
  goMeditationResponseSchema,
  meditationInfoResponseSchema,
  MeditatonFormSchema,
  getMeditationRewardRequestSchema,
  getMeditationRewardResponseSchema,
  getMeditationRewardErrorResponseSchema,
} from "./schemas";

export type MeditationInfoResponse = z.infer<typeof meditationInfoResponseSchema>;
export type MeditationInfoErrorResponse = z.infer<typeof meditationInfoErrorResponseSchema>;

export type goMeditationResponseType = z.infer<typeof goMeditationResponseSchema>;
export type goMeditationErrorResponseType = z.infer<typeof goMeditationErrorResponseSchema>;
export type goMeditationRequestType = z.infer<typeof goMeditationRequestSchema>;
export type MeditatonFormType = z.infer<typeof MeditatonFormSchema>;

export type GetMeditationRewardRequestType = z.infer<typeof getMeditationRewardRequestSchema>;
export type GetMeditationRewardResponseType = z.infer<typeof getMeditationRewardResponseSchema>;
export type GetMeditationRewardErrorResponseType = z.infer<typeof getMeditationRewardErrorResponseSchema>;
