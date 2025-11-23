import z from "zod";
import { ratingsResponseSchema, RatingUnionSchema, userCountInFrResponseSchema } from "./schemas";

export type UserCountInFrResponseType = z.infer<typeof userCountInFrResponseSchema>;
export type RatingUnionType = z.infer<typeof RatingUnionSchema>;
export type RatingsResponseType = z.infer<typeof ratingsResponseSchema>;
