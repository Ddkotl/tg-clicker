export function getHoursString(hours: number): string {
  if (hours === 1) {
    return `one`;
  } else if (hours >= 2 && hours <= 4) {
    return `few`;
  } else {
    return `many`;
  }
}
