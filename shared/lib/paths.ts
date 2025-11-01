export const ui_path = {
  auth_page: () => `/`,
  home_page: () => `/game`,
  registration_page: () => `/registration`,
  facts_page: () => `/game/facts`,
  missions_page: () => `/game/headquarter/missions`,
  mine_page: () => `/game/headquarter/mine`,
  meditation_page: () => `/game/headquarter/meditation`,
  spirit_path_page: () => `/game/headquarter/spirit_path`,
  city_shop_page: () => `/game/city/shop`,
};

export const api_path = {
  auth: () => `/api/auth`,
  registration: () => `/api/auth/registration`,
  go_meditation: () => `/api/headquarter/meditation`,
  go_spirit_path: () => `/api/headquarter/spirit_path/go_spirit_path`,
  get_meditation_revard: () => `/api/headquarter/meditation/get_meditation_reward`,
  get_spirit_path_reward: () => `/api/headquarter/spirit_path/get_spirit_path_reward`,
  get_daily_missions: (userId: string) => `/api/user/daily_mission?userId=${userId}`,
  create_daily_missions: (userId: string) => `/api/user/daily_mission?userId=${userId}`,
  get_action_token: () => `/api/user/action-token`,
  get_facts: (userId: string, page: number, pageSize: number) =>
    `/api/user/facts?userId=${userId}&page=${page}&pageSize=${pageSize}`,
  get_facts_count_nocheck: (userId: string) => `/api/user/facts/count_nocheck?userId=${userId}`,
  check_all_facts: (userId: string) => `/api/user/facts/check_all?userId=${userId}`,
  facts_sse: (userId: string) => `/api/user/facts/stream?userId=${userId}`,
  mining_qi_stone: () => `/api/headquarter/mine`,
};
