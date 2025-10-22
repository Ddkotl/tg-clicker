function giveExperience(min: number, max: number): number {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export function getMeditationExperience(hour: number) {
  return giveExperience(1 * hour, 2 * hour);
}

export function getMineExperience(reward: number) {
  return giveExperience(1, reward);
}
