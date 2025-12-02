import { EnemyType, FightStatus } from "@/_generated/prisma";
import { RatingsMetrics, RatingsTypes } from "@/entities/statistics/_domain/types";

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
  get_fight: ({ enemyType, fightId, status }: { enemyType?: EnemyType; fightId?: string; status?: FightStatus }) => [
    "get_fight",
    enemyType ?? null,
    fightId ?? null,
    status ?? null,
  ],
  ratings_type: (type: RatingsTypes, metric: RatingsMetrics, page: number) => ["rating", type, metric, page],
};
