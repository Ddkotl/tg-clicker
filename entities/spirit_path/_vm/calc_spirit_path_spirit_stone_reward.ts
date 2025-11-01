export function calcSpiritPathSpiritStoneReward(minutes: number) {
  if (minutes <= 60) return 0;

  const hours = minutes / 60;

  const minReward = Math.floor((hours - 1) * 5);
  const maxReward = Math.floor((hours - 1) * 8);

  const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;

  return reward;
}
