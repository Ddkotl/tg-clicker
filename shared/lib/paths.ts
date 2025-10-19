export const ui_path = {
  facts_page: () => `/game/facts`,
  meditation_page: () => `/game/headquarter/meditation`,
  city_shop_page: () => `/game/city/shop`,
};

export const api_path = {
  get_facts: (userId: string) => `/api/user/facts?userId=${userId}`,
  check_all_facts: (userId: string) => `/api/user/facts/check_all?userId=${userId}`,
  facts_sse: (userId: string) => `/api/user/facts/stream?userId=${userId}`,
};
