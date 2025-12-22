import z from "zod";
import {
  fightResponseSchema,
  fighterSnapshotSchema,
  fightLogStepSchema,
  fightResRewardsSchema,
  fightSnapshotSchema,
  fightResLossesSchema,
} from "./schemas";

export type FightResponseType = z.infer<typeof fightResponseSchema>;

export type FighterSnapshot = z.infer<typeof fighterSnapshotSchema>;

export type FightSnapshot = z.infer<typeof fightSnapshotSchema>;

export type FightLogStep = z.infer<typeof fightLogStepSchema>;

export type FightLog = FightLogStep[];

export type FightResRewards = z.infer<typeof fightResRewardsSchema>;
export type FightResLossesSchema = z.infer<typeof fightResLossesSchema>;
export interface FightResult {
  result: "WIN" | "LOSE";
  log: FightLog;
  playerHp: number;
  enemyHp: number;
  totalPlayerDamage: number;
  totalEnemyDamage: number;
}
