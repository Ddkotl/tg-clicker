import z from "zod";
import { userCountInFrErrorResponseSchema, userCountInFrResponseSchema } from "./schemas";

export type UserCountInFrResponseType = z.infer<typeof userCountInFrResponseSchema>;
export type UserCountInFrErrorResponseType = z.infer<typeof userCountInFrErrorResponseSchema>;
