import z from "zod";
import { ratingsResponseSchema, RatingUnionSchema, userCountInFrResponseSchema } from "./schemas";

export type UserCountInFrResponseType = z.infer<typeof userCountInFrResponseSchema>;
export type RatingUnionType = z.infer<typeof RatingUnionSchema>;
export type RatingsResponseType = z.infer<typeof ratingsResponseSchema>;

export type RankingCardProps = {
  userId: string;
  rank: number;
  img?: string | null;
  nickname: string | null;
  valueLabel: string;
  value: number;
  isFetching?: boolean;
};

export const ratingsTypes = {
  overall: "overall",
  monthly: "monthly",
  weekly: "weekly",
  daily: "daily",
};
export type RatingsTypes = keyof typeof ratingsTypes;
export const ratingMetrics = {
  exp: "exp",
  meditated_hours: "meditated_hours",
  spirit_path_minutes: "spirit_path_minutes",
  mined_qi_stone: "mined_qi_stone",
  fights_wins: "fights_wins",
};
export type RatingsMetrics = keyof typeof ratingMetrics;
