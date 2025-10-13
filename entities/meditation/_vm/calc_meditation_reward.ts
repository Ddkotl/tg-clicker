export function calcMeditationReward({
  power,
  protection,
  speed,
  skill,
  qi,
  hours,
}: {
  power: number;
  protection: number;
  speed: number;
  skill: number;
  qi: number;
  hours: number;
}) {
  //изменить позже
  return (1000 + power + protection + speed + skill + qi) * hours;
}
