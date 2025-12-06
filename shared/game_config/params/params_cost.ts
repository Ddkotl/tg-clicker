import { Profile } from "@/_generated/prisma/client";
import { translate } from "@/features/translations/server/translate_fn";
import { SupportedLang } from "@/features/translations/translate_type";
import { img_paths } from "@/shared/lib/img_paths";

type ParamConfig = {
  base: number;
  factor: number;
  exp: number;
  name: ParamsKeys;
  title?: string;
  description?: string;
  icon?: string;
};
export type ParamsKeys = keyof Pick<Profile, "power" | "protection" | "speed" | "skill" | "qi_param">;

export function GenerateParamsConfig({ lang = "en" }: { lang?: SupportedLang }): Record<ParamsKeys, ParamConfig> {
  return {
    power: {
      base: 10,
      factor: 1.8,
      exp: 2,
      name: "power",
      title: `${translate("training.power", lang)}`,
      description: `${translate("training.power_desc", lang)}`,
      icon: img_paths.params_training.power(),
    },
    protection: {
      base: 10,
      factor: 1.7,
      exp: 1.4,
      name: "protection",
      title: `${translate("training.protection", lang)}`,
      description: `${translate("training.protection_desc", lang)}`,
      icon: img_paths.params_training.protection(),
    },
    speed: {
      base: 10,
      factor: 1.5,
      exp: 1.2,
      name: "speed",
      title: `${translate("training.speed", lang)}`,
      description: `${translate("training.speed_desc", lang)}`,
      icon: img_paths.params_training.speed(),
    },
    skill: {
      base: 10,
      factor: 1.6,
      exp: 1.8,
      name: "skill",
      title: `${translate("training.skill", lang)}`,
      description: `${translate("training.skill_desc", lang)}`,
      icon: img_paths.params_training.skill(),
    },
    qi_param: {
      base: 10,
      factor: 1.9,
      exp: 2.5,
      name: "qi_param",
      title: `${translate("training.qi_param", lang)}`,
      description: `${translate("training.qi_param_desc", lang)}`,
      icon: img_paths.params_training.qi_param(),
    },
  };
}

export function calcParamCost(paramName: ParamsKeys, lvl: number) {
  const { base, factor, exp } = GenerateParamsConfig({})[paramName];
  return Math.floor(base + factor * Math.pow(lvl, exp));
}
