import { statisticRepository } from "../index.server";

export const OverallRatingsMAP = {
  overall: statisticRepository.getOverallRating,
  meditation: statisticRepository.getMeditationRating,
  spirit: statisticRepository.getSpiritPathRating,
  mining: statisticRepository.getMiningRating,
  wins: statisticRepository.getWinsRating,
};
export type OverallRatingsMAP_Type = keyof typeof OverallRatingsMAP;
