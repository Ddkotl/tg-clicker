import z from "zod";
import { ratingsOverallResponseSchema, RatingUnionSchema, userCountInFrResponseSchema } from "./schemas";

export type UserCountInFrResponseType = z.infer<typeof userCountInFrResponseSchema>;
export type RatingUnionType = z.infer<typeof RatingUnionSchema>;
export type RatingsOverallResponseType = z.infer<typeof ratingsOverallResponseSchema>;
