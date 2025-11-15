import z from "zod";
import {
  fightResponseSchema,
  fighterSnapshotSchema,
  fightLogStepSchema,
  fightResRewardsSchema,
  fightSnapshotSchema,
} from "./schemas";

export type CreateFightResponseType = z.infer<typeof fightResponseSchema>;

export type FighterSnapshot = z.infer<typeof fighterSnapshotSchema>;

export type FightSnapshot = z.infer<typeof fightSnapshotSchema>;

export type FightLogStep = z.infer<typeof fightLogStepSchema>;

export type FightLog = FightLogStep[];

export type FightResRewards = z.infer<typeof fightResRewardsSchema>;
