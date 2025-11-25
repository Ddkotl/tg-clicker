import { Profile } from "@/_generated/prisma";

export type ParamsKeys = keyof Pick<Profile, "power" | "protection" | "speed" | "skill" | "qi_param">;

export const PaaramsList = [
  "power",
  "protection",
  "speed",
  "skill",
  "qi_param",
] as const satisfies readonly ParamsKeys[];
