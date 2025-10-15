import z from "zod";
import {
  profileErrorResponseSchema,
  profileResponseSchema,
  trainErrorResponseSchema,
  trainResponseSchema,
} from "./schemas";

export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfileErrorResponse = z.infer<typeof profileErrorResponseSchema>;

export type TrainResponseType = z.infer<typeof trainResponseSchema>;
export type TrainErrorResponseType = z.infer<typeof trainErrorResponseSchema>;
