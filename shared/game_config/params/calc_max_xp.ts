// Параметры с их коэффициентами влияния на здоровье
export const PARAMS: Record<string, number> = {
  power: 1.5, // коэффициент влияния параметра на здоровье
  protection: 2.2,
  speed: 2.0,
  skill: 1.5,
  qi_param: 1.4,
};

// Функция для расчёта максимального здоровья
export function calcMaxHP({
  power,
  protection,
  speed,
  skill,
  qi_param,
  level,
}: {
  power: number;
  protection: number;
  speed: number;
  skill: number;
  qi_param: number;
  level: number;
}) {
  // Базовое здоровье
  const baseHealth = 100;

  // Рассчитываем влияние каждого параметра на здоровье
  const powerHealth = power * PARAMS.power;
  const protectionHealth = protection * PARAMS.protection;
  const speedHealth = speed * PARAMS.speed;
  const skillHealth = skill * PARAMS.skill;
  const qiHealth = qi_param * PARAMS.qi_param;

  // Добавляем влияние уровня игрока
  const levelBonus = level * 10; // Например, 10 хп за каждый уровень

  // Итоговое максимальное здоровье
  return baseHealth + powerHealth + protectionHealth + speedHealth + skillHealth + qiHealth + levelBonus;
}
