import { MissionTime, MissionType } from "@/_generated/prisma";
import { ui_path } from "@/shared/lib/paths";

export type PermanentMission = {
  type: MissionType;
  time: MissionTime;
  target_value: number;
  reward_spirit_cristal: number;
  path: string;
};

export const daily_missions: PermanentMission[] = [
  {
    type: MissionType.MEDITATION,
    time: MissionTime.DAILY,
    target_value: 1,
    reward_spirit_cristal: 100,
    path: ui_path.meditation_page(),
  },
];
