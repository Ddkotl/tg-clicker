import { statisticRepository } from "../index.server";

export const OverallRatingsMAP = {
  exp: statisticRepository.getExpRating,
  meditation: statisticRepository.getMeditationRating,
  spirit: statisticRepository.getSpiritPathRating,
  mining: statisticRepository.getMiningRating,
  wins: statisticRepository.getWinsRating,
};
export const OverallRatingsMAP_KEYS = Object.keys(OverallRatingsMAP).reduce(
  (acc, key) => {
    acc[key as keyof typeof OverallRatingsMAP] = key as keyof typeof OverallRatingsMAP;
    return acc;
  },
  {} as Record<keyof typeof OverallRatingsMAP, keyof typeof OverallRatingsMAP>,
);

export type OverallRatingsMAP_Type = keyof typeof OverallRatingsMAP;
