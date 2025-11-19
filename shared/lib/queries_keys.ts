import { OverallRatingsMAP_Type } from "@/entities/statistics/_domain/ratings_list_items";

export const queries_keys = {
  tg_auth: () => ["telegramAuth"],
  session: () => ["session"],
  profile_userId: (userId: string) => ["profile", userId],
  meditation_userId: (userId: string) => ["meditation", userId],
  daily_missions_userId: (userId: string) => ["daily_missions", userId],
  spirit_path_userId: (userId: string) => ["spirit_path", userId],
  facts_userId: (userId: string) => ["facts", userId],
  mine_userId: (userId: string) => ["mine", userId],
  qi_skills_userId: (userId: string) => ["qi_skills", userId],
  current_fight: () => ["currentFight"],
  ratings_type: (type: OverallRatingsMAP_Type, page: number) => ["rating", type, page],
};
