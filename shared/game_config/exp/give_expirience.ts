function giveExperience(min: number, max: number): number {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export function getMeditationExperience(hour: number) {
  return giveExperience(1, 2 * hour);
}

export function getSpiritPathExperience(minutes: number) {
  if (minutes < 60) {
    return giveExperience(1, 3);
  }
  return giveExperience(1, minutes / 30);
}

export function getMineExperience() {
  return giveExperience(1, 5);
}
