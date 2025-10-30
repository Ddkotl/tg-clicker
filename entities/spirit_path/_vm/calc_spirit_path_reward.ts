import { calcParamCost } from "@/shared/game_config/params/params_cost";

export function calcSpiritPathReward({
  power,
  protection,
  speed,
  skill,
  qi_param,
  minutes,
}: {
  power: number;
  protection: number;
  speed: number;
  skill: number;
  qi_param: number;
  minutes: number;
}) {
  const powerCost = calcParamCost("power", power + 1);
  const protectionCost = calcParamCost("protection", protection + 1);
  const speedCost = calcParamCost("speed", speed + 1);
  const skillCost = calcParamCost("skill", skill + 1);
  const qiCost = calcParamCost("qi_param", qi_param + 1);

  const totalCost = powerCost + protectionCost + speedCost + skillCost + qiCost;

  const rewardCoefficient = 0.025;
  return Math.floor((totalCost * rewardCoefficient * minutes) / 60);
}
