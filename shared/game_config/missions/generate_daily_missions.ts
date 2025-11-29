import { MissionType } from "@/_generated/prisma";
import { ui_path } from "@/shared/lib/paths";

export function generateDailyMissions(
  lvl: number,
  power: number,
  qi_param: number,
  speed: number,
  protection: number,
  skill: number,
) {
  // 🔹 Коэффициент сложности
  const difficulty = 1 + Math.log10(lvl + 1) + (power + qi_param + speed + protection + skill) / 200;

  // 🔹 Формула плавного роста наград
  const rewardBase = (base: number) => Math.floor(base * difficulty);

  // 🔹 Определяем миссии с учётом уровня
  const daily_missions = [
    {
      type: MissionType.MEDITATION,
      target_value: 1 + Math.floor(lvl / 2),
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.meditation_page(),
    },
    {
      type: MissionType.SPIRIT_PATH,
      target_value: Math.min(10 * lvl, 480),
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.spirit_path_page(),
    },
    {
      type: MissionType.MINE,
      target_value: 5 + Math.floor(lvl / 3),
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.mine_page(),
    },
    {
      type: MissionType.MINE_STONE,
      target_value: 10 + lvl * 1,
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.mine_page(),
    },
    {
      type: MissionType.DAMAGE,
      target_value: 200 * lvl,
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.fight_page(),
    },
    {
      type: MissionType.FIGHTS_WINS,
      target_value: 5 + lvl,
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.fight_page(),
    },
    {
      type: MissionType.GET_GLORY,
      target_value: 10 + lvl * 2,
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.fight_page(),
    },
    {
      type: MissionType.ROBBERY_QI_ENERGY,
      target_value: 400 * lvl,
      reward_glory: rewardBase(1),
      reward_exp: rewardBase(5),
      reward_qi: rewardBase(30),
      reward_qi_stone: rewardBase(3),
      reward_spirit_cristal: rewardBase(0),
      path: ui_path.fight_page(),
    },
  ];
  return daily_missions;
}
