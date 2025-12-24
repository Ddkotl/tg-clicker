import { MissionTime, MissionType } from "@/_generated/prisma/enums";
import { SupportedLang } from "@/features/translations/translate_type";

export type PermanentMission = {
  type: MissionType;
  time: MissionTime;
  lang: SupportedLang;
  target_value: number;
  reward_spirit_cristal: number;
  path: string;
};
const base_config = {
  type: MissionType.SUBSCRIBE,
  time: MissionTime.PERMANENT,
  target_value: 1,
};
export const permanent_missions: PermanentMission[] = [
  {
    ...base_config,
    lang: "en",
    reward_spirit_cristal: 100,
    path: "https://t.me/cripto_digest_en",
    chanel_title: "Crypto Digest: Short and Clear"
  },
  {
    ...base_config,
    lang: "ru",
    reward_spirit_cristal: 100,
    path: "https://t.me/cripto_digest",
    chanel_title: "Крипто-Дайджест: Коротко и Ясно"
  },
];
