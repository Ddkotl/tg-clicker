import { EnemyType, FightResult, FightStatus, FightType } from "@/_generated/prisma";
import { JsonValue } from "@/_generated/prisma/runtime/library";
import z from "zod";

export const fightRequestSchema = z.object({ enemyType: z.enum(EnemyType), fightType: z.enum(FightType) });

export const fighterSnapshotSchema = z.object({
  userId: z.string().optional(),
  avatar_url: z.string(),
  name: z.string(),
  power: z.number(),
  protection: z.number(),
  speed: z.number(),
  skill: z.number(),
  qi_param: z.number(),
  currentHp: z.number(),
  maxHp: z.number(),
});

export const fightSnapshotSchema = z.object({
  player: fighterSnapshotSchema,
  enemy: fighterSnapshotSchema,
});

export const fightLogStepSchema = z.object({
  timestamp: z.string(),
  attacker: z.enum(["player", "enemy"]),
  damage: z.number(),
  attackerHpAfter: z.number(),
  defenderHpAfter: z.number(),
  text: z.string(),
});

export const fightLogSchema = z.array(fightLogStepSchema);

export const fightResRewardsSchema = z.object({
  exp: z.number().optional(),
  qi: z.number(),
  qiStone: z.number().optional(),
  spiritCristal: z.number().optional(),
  glory: z.number().optional(),
});

export const fightSchema = z.object({
  enemyType: z.enum(EnemyType),
  result: z.enum(FightResult).nullable(),
  id: z.string(),
  type: z.enum(FightType),
  status: z.enum(FightStatus),
  attackerId: z.string(),
  defenderId: z.string().nullable(),
  enemyNpcId: z.string().nullable(),
  snapshot: z.custom<JsonValue>().nullable(),
  fightLog: z.custom<JsonValue>().nullable(),
  rewards: z.custom<JsonValue>().nullable(),
  startedAt: z.date(),
  finishedAt: z.date().nullable(),
});
export const fightResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: fightSchema,
});
