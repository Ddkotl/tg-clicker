import { calcParamCost } from "@/shared/game_config/params/params_cost";

export function calcMeditationReward({
  power,
  protection,
  speed,
  skill,
  qi_param,
  hours,
}: {
  power: number;
  protection: number;
  speed: number;
  skill: number;
  qi_param: number;
  hours: number;
}) {
  // Рассчитываем стоимость улучшения каждого параметра до следующего уровня
  const powerCost = calcParamCost("power", power + 1); // Стоимость прокачки power
  const protectionCost = calcParamCost("protection", protection + 1); // Стоимость прокачки protection
  const speedCost = calcParamCost("speed", speed + 1); // Стоимость прокачки speed
  const skillCost = calcParamCost("skill", skill + 1); // Стоимость прокачки skill
  const qiCost = calcParamCost("qi_param", qi_param + 1); // Стоимость прокачки qi

  // Суммируем все стоимости прокачки параметров
  const totalCost = powerCost + protectionCost + speedCost + skillCost + qiCost;

  // Коэффициент, который определяет размер награды относительно стоимости улучшений
  const rewardCoefficient = 0.05; // 0.5 означает, что награда будет половиной стоимости прокачки

  // Итоговая награда = общая стоимость прокачки * коэффициент * количество часов
  return Math.floor(totalCost * rewardCoefficient * hours);
}
