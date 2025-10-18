export const ui_path = {
  facts_page: () => `/game/facts`,
  city_shop_page: () => `/game/city/shop`,
};

export const api_path = {
  get_facts: (userId: string) => `/api/user/facts?userId=${userId}`,
};
