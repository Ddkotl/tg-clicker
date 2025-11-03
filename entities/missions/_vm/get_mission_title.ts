import { MissionType } from "@/_generated/prisma";
import { getHoursString } from "@/entities/meditation/_vm/getHoursString";
import { TranslationKey } from "@/features/translations/translate_type";

interface Mission {
  type: MissionType;
  target_value: number;
}

export function getMissionTitle(
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string,
  mission: Mission,
): string {
  const { type, target_value } = mission;

  const target =
    type === MissionType.MEDITATION
      ? `${target_value} ${t(`hour.${getHoursString(target_value)}` as TranslationKey)}`
      : target_value;

  return t(`headquarter.missions.types.${type}.title`, {
    target,
  });
}
