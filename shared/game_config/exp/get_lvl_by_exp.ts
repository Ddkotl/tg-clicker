import { lvl_exp } from "./lvl_exp";

export function getLevelByExp(exp: number): number {
  let level = 1;

  for (const [lvlStr, lvlExp] of Object.entries(lvl_exp)) {
    const lvl = Number(lvlStr);
    if (exp >= lvlExp) {
      level = lvl;
    } else {
      break;
    }
  }

  return level;
}
