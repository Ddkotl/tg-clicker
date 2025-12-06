import { EnemyType, FightStatus } from "@/_generated/prisma";
import { RatingsMetrics, RatingsTypes } from "@/entities/statistics/_domain/types";

export const ui_path = {
  auth_page: () => `/`,
  home_page: () => `/game`,
  registration_page: () => `/registration`,
  profile_page: (userId: string) => `/game/profile/${userId}`,
  facts_page: () => `/game/facts`,
  fight_page: () => `/game/fight`,
  referals_page: () => `/game/referals`,
  fight_result_page: (id: string) => `/game/fight/result/${id}`,
  fight_enemy_page: (type: EnemyType) => `/game/fight/${type}`,
  headquarter_page: () => `/game/headquarter`,
  city_page: () => `/game/city`,
  pet_page: () => `/game/pet`,
  rankings_page: () => `/game/ranking`,
  rankings_type_page: (type: RatingsTypes, metric: RatingsMetrics, page?: number) =>
    `/game/ranking/${type}/${metric}${page ? `?page=${page}` : ""}`,
  qi_skills_page: () => `/game/headquarter/qi_skills`,
  missions_page: () => `/game/headquarter/missions`,
  mine_page: () => `/game/headquarter/mine`,
  meditation_page: () => `/game/headquarter/meditation`,
  spirit_path_page: () => `/game/headquarter/spirit_path`,
  city_shop_page: () => `/game/city/shop`,
};

export const api_path = {
  auth: () => `/api/auth`,
  registration: () => `/api/auth/registration`,
  get_session: () => `api/session`,
  get_profile: (userId: string) => `/api/user/profile?userId=${userId}`,
  go_meditation: () => `/api/headquarter/meditation`,
  go_spirit_path: () => `/api/headquarter/spirit_path/go_spirit_path`,
  get_meditation_revard: () => `/api/headquarter/meditation/get_meditation_reward`,
  get_spirit_path_reward: () => `/api/headquarter/spirit_path/get_spirit_path_reward`,
  get_spirit_path_info: (userId: string) => `/api/headquarter/spirit_path?userId=${userId}`,
  get_daily_missions: (userId: string) => `/api/user/daily_mission?userId=${userId}`,
  create_daily_missions: (userId: string) => `/api/user/daily_mission?userId=${userId}`,
  get_action_token: () => `/api/auth/action-token`,
  get_facts: (userId: string, page: number, pageSize: number) =>
    `/api/user/facts?userId=${userId}&page=${page}&pageSize=${pageSize}`,
  get_facts_count_nocheck: (userId: string) => `/api/user/facts/count_nocheck?userId=${userId}`,
  check_all_facts: (userId: string) => `/api/user/facts/check_all?userId=${userId}`,
  facts_sse: (userId: string) => `/api/user/facts/stream?userId=${userId}`,
  mining_qi_stone: () => `/api/headquarter/mine`,
  get_user_qi_skills: (userId: string) => `/api/user/qi_skills?userId=${userId}`,
  upgrade_user_qi_skills: (userId: string) => `/api/user/qi_skills/upgrade?userId=${userId}`,
  create_fight: () => `/api/fight/create`,
  start_fight: () => `/api/fight/attack`,
  get_fight: ({ enemyType, fightId, status }: { enemyType?: EnemyType; fightId?: string; status?: FightStatus }) =>
    `/api/fight?${enemyType ? `enemyType=${enemyType}&` : ""}&${fightId ? `fightId=${fightId}&` : ""}${status ? `status=${status}` : ""}`,
  get_ratings: (type: RatingsTypes, metric: RatingsMetrics, page: number) =>
    `/api/statistics/rating/${type}/${metric}?page=${page}`,
  get_user_stats: (type: RatingsTypes, userId: string) => `/api/user/statistics/${userId}/${type}`,
};
