export const queries_keys = {
  tg_auth: () => ["telegramAuth"],
  profile_userId: (userId: string) => ["profile", userId],
  meditation_userId: (userId: string) => ["meditation", userId],
  daily_missions_userId: (userId: string) => ["daily_missions", userId],
  spirit_path_userId: (userId: string) => ["spirit_path", userId],
  facts_userId: (userId: string) => ["facts", userId],
  mine_userId: (userId: string) => ["mine", userId],
};
