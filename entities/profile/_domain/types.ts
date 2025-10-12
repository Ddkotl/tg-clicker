import z from "zod";
import { profileErrorResponseSchema, profileResponseSchema } from "./schemas";

export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfileErrorResponse = z.infer<typeof profileErrorResponseSchema>;
