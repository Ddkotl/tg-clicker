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
    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1002981518597",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1002917631580",
  },
    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1003020639758",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1003008443120",
  },
    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1002975000357",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1002020692626",
  },
    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1003071514993",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1003103228886",
  },
    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1003079394204",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1002650446328",
  },

    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1003518869157",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1003606280207",
  },
    {
    ...base_config,
    chanel_lang: "en",
    reward_spirit_cristal: 100,
    chanel_id: "-1002809518283",
  },
    {
    ...base_config,
    chanel_lang: "ru",
    reward_spirit_cristal: 100,
    chanel_id: "-1002740351168",
  },
];
