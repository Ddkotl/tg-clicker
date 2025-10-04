type ParamConfig = {
  base: number;
  factor: number;
  exp: number;
};

const PARAMS: Record<string, ParamConfig> = {
  power: { base: 10, factor: 1.8, exp: 2 },
  protection: { base: 10, factor: 1.7, exp: 1.4 },
  speed: { base: 10, factor: 1.5, exp: 1.2 },
  skill: { base: 10, factor: 1.6, exp: 1.8 },
  qi: { base: 10, factor: 1.9, exp: 2.5 },
};

export function calcParamCost(paramName: keyof typeof PARAMS, lvl: number) {
  const { base, factor, exp } = PARAMS[paramName];
  return Math.floor(base + factor * Math.pow(lvl, exp));
}
