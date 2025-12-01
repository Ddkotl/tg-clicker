import { FightLog, FightResRewards, FightResLossesSchema } from "../_domain/types";

export function formatFightResult({
  result,
  log,
  rewards,
  losses,
  attackerName = "Ты",
  enemyName = "Противник",
}: {
  result: "WIN" | "LOSE" | "DRAW" | null;
  log: FightLog;
  rewards: FightResRewards | null;
  losses: FightResLossesSchema | null;
  attackerName?: string;
  enemyName?: string;
}) {
  if (!log || log.length === 0) {
    return { error: "Лог боя пуст" };
  }

  // ==========================
  //   Урон
  // ==========================
  const totalPlayerDmg = log.filter((e) => e.attacker === "player").reduce((acc, e) => acc + e.damage, 0);

  const totalEnemyDmg = log.filter((e) => e.attacker === "enemy").reduce((acc, e) => acc + e.damage, 0);

  // ==========================
  //   Прошедший бой
  // ==========================
  const last = log[log.length - 1];
  const playerHpLeft = last?.defenderHpAfter ?? 0;
  const enemyHpLeft = last?.attackerHpAfter ?? 0;

  // ==========================
  //   Причина победы / поражения
  // ==========================
  let reason = "";
  if (result === "WIN") {
    if (totalPlayerDmg > totalEnemyDmg) reason = "Ты нанес больше суммарного урона.";
    else if (enemyHpLeft <= 0) reason = "Ты полностью уничтожил противника.";
    else reason = "Ты превзошёл противника в бою.";
  }

  if (result === "LOSE") {
    if (playerHpLeft <= 1) reason = `У тебя остался ${playerHpLeft} пункт здоровья.`;
    else reason = "Противник оказался сильнее.";
  }

  if (result === "DRAW") {
    reason = "Бой завершился вничью.";
  }

  // ==========================
  //   Формат наград
  // ==========================
  const rewardsText = rewards
    ? Object.entries(rewards)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: +${v}`)
        .join(", ")
    : null;

  // ==========================
  //   Формат потерь
  // ==========================
  const lossesText = losses
    ? Object.entries(losses)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: -${v}`)
        .join(", ")
    : null;

  // Возвращаем готовую структуру для UI
  return {
    result,
    reason,
    rewards: rewardsText,
    losses: lossesText,
    dmg: {
      [attackerName]: totalPlayerDmg,
      [enemyName]: totalEnemyDmg,
    },
    hp: {
      [attackerName]: playerHpLeft,
      [enemyName]: enemyHpLeft,
    },
  };
}
