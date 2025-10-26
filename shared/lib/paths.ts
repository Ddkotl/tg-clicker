export const ui_path = {
  home_page: () => `/game`,
  facts_page: () => `/game/facts`,
  mine_page: () => `/game/headquarter/mine`,
  meditation_page: () => `/game/headquarter/meditation`,
  city_shop_page: () => `/game/city/shop`,
};

export const api_path = {
  auth: () => `/api/auth`,
  registration: () => `/api/auth/registration`,
  go_meditation: () => `/api/headquarter/meditation`,
  get_meditation_revard: () => `/api/headquarter/meditation/get_meditation_reward`,
  get_action_token: () => `/api/auth/action-token`,
  get_facts: (userId: string, page: number, pageSize: number) =>
    `/api/user/facts?userId=${userId}&page=${page}&pageSize=${pageSize}`,
  get_facts_count_nocheck: (userId: string) => `/api/user/facts/count_nocheck?userId=${userId}`,
  check_all_facts: (userId: string) => `/api/user/facts/check_all?userId=${userId}`,
  facts_sse: (userId: string) => `/api/user/facts/stream?userId=${userId}`,
  mining_gold: () => `/api/headquarter/mine`,
};
