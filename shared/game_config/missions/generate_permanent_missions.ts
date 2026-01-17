import { MissionTime, MissionType } from "@/_generated/prisma/enums";
export type PermanentMission = {
  type: MissionType;
  time: MissionTime;
  target_value: number;
  reward_spirit_cristal: number;
  chanel_id: string;
  chanel_lang: string;
};

const base_config = {
  type: MissionType.SUBSCRIBE,
  time: MissionTime.PERMANENT,
  target_value: 1,
};
export const permanent_missions: PermanentMission[] = [
  {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1003013675509",
  },
  {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1003089289559",
  },
  {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1003622867278",
  },
  {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1003573331951",
  },
];
