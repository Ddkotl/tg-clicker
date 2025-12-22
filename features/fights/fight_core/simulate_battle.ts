// Combat Simulation v2.1
// Draws removed: in case of tie, defender выигрывает

import { FighterSnapshot, FightLog } from "@/entities/fights";
import { FightResult } from "@/entities/fights/_domain/types";

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function logistic(a: number, b: number, scale = 35) {
  return 1 / (1 + Math.exp(-(a - b) / scale));
}

export function chanceScaled(a: number, b: number, scale = 35, min = 0.05, max = 0.45) {
  return clamp(logistic(a, b, scale), min, max);
}

export function diminish(val: number, softCap = 300) {
  return Math.sqrt(val + softCap) - Math.sqrt(softCap);
}

export function qiInfluence(attQi: number, defQi: number, maxPct = 0.3, soften = 80) {
  const diff = attQi - defQi;
  const s = diff / (Math.abs(diff) + soften);
  return s * maxPct;
}

export function penetrationPct(attSkill: number, defProt: number, maxPen = 0.45) {
  const raw = attSkill / (attSkill + defProt + 100);
  return clamp(raw, 0.01, maxPen);
}

function computeHit(att: FighterSnapshot, def: FighterSnapshot) {
  const dodgeChance = chanceScaled(def.speed, att.skill, 28, 0.03, 0.5);
  const critChance = chanceScaled(att.skill, def.speed, 28, 0.03, 0.5);
  const blockBase = chanceScaled(def.skill, att.skill, 34, 0.02, 0.45);
  const blockChance = clamp(blockBase * 1.6, 0.02, 0.6);
  const penetration = penetrationPct(att.skill, def.protection, 0.45);
  const qiBonus = qiInfluence(att.qi_param, def.qi_param, 0.3, 100);
  const critMult = 1.5 + att.qi_param / 300;

  if (Math.random() < dodgeChance) return { dmg: 0, crit: false, block: false, dodge: true, penetration };

  const isBlock = Math.random() < blockChance;
  const isCrit = Math.random() < critChance;
  const effectiveDefBase = diminish(def.protection, 250);
  const effectiveDefAfterPen = effectiveDefBase * (1 - penetration);
  const effectiveDef = isBlock ? effectiveDefAfterPen * 1.2 : effectiveDefAfterPen * 0.7;
  const scaledAtk = diminish(att.power, 120);
  let raw = Math.max(1, scaledAtk - effectiveDef);
  raw *= 1 + qiBonus;
  if (isCrit) raw *= critMult;
  const dmg = Math.max(0, Math.round(raw));

  return { dmg, crit: isCrit, block: isBlock, dodge: false, penetration };
}

export function simulateBattle(playerRaw: FighterSnapshot, enemyRaw: FighterSnapshot, maxRounds = 20): FightResult {
  const player: FighterSnapshot = { ...playerRaw };
  const enemy: FighterSnapshot = { ...enemyRaw };
  const initialPlayerHp = player.currentHp;
  const initialEnemyHp = enemy.currentHp;
  const log: FightLog = [];

  for (let round = 1; round <= maxRounds; round++) {
    if (player.currentHp <= 0 || enemy.currentHp <= 0) break;
    const firstIsPlayer =
      player.speed > enemy.speed || (player.speed === enemy.speed && player.qi_param >= enemy.qi_param);
    const first = firstIsPlayer ? player : enemy;
    const second = firstIsPlayer ? enemy : player;

    const hit1 = computeHit(first, second);
    second.currentHp = Math.max(0, second.currentHp - hit1.dmg);
    log.push({
      timestamp: new Date().toISOString(),
      attacker: first.name,
      defender: second.name,
      damage: hit1.dmg,
      attackerHpAfter: first.currentHp,
      defenderHpAfter: second.currentHp,
      crit: hit1.crit,
      block: hit1.block,
      dodge: hit1.dodge,
      penetration: hit1.penetration,
    });
    if (second.currentHp <= 0) break;

    const hit2 = computeHit(second, first);
    first.currentHp = Math.max(0, first.currentHp - hit2.dmg);
    log.push({
      timestamp: new Date().toISOString(),
      attacker: second.name,
      defender: first.name,
      damage: hit2.dmg,
      attackerHpAfter: second.currentHp,
      defenderHpAfter: first.currentHp,
      crit: hit2.crit,
      block: hit2.block,
      dodge: hit2.dodge,
      penetration: hit2.penetration,
    });
    if (first.currentHp <= 0) break;
  }

  player.currentHp = Math.max(0, player.currentHp);
  enemy.currentHp = Math.max(0, enemy.currentHp);
  const totalPlayerDamage = initialEnemyHp - enemy.currentHp;
  const totalEnemyDamage = initialPlayerHp - player.currentHp;

  let result: "WIN" | "LOSE";
  if (player.currentHp === 0 && enemy.currentHp > 0) result = "LOSE";
  else if (enemy.currentHp === 0 && player.currentHp > 0) result = "WIN";
  else {
    // No draw: defender (enemy) победил при равенстве или если оба живы
    result = totalPlayerDamage > totalEnemyDamage ? "WIN" : "LOSE";
  }

  return { result, log, playerHp: player.currentHp, enemyHp: enemy.currentHp, totalPlayerDamage, totalEnemyDamage };
}
