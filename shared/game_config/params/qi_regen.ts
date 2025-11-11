import { QiSkillsConfig } from "../qi_skills/qi_skills";

export const QI_REGEN_INTERVAL = 1 * 60 * 1000;

export function getQiRegenPerInterval({
  qi_param,
  power,
  protection,
  speed,
  skill,
  lvl,
  circulation_of_life,
  interval,
}: {
  qi_param: number;
  power: number;
  protection: number;
  speed: number;
  skill: number;
  lvl: number;
  circulation_of_life: number;
  interval: number;
}): number {
  const baseGainToHour =
    (1 + qi_param * 0.8 + (power + protection + speed + skill) * 0.3 + lvl * 0.5) *
    (10 + QiSkillsConfig.circulation_of_life.effects(circulation_of_life) * 10);

  const regen_to_interval = (baseGainToHour * interval) / (60 * 60 * 1000);
  return Math.floor(regen_to_interval);
}
