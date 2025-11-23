import { Fraktion, UserDailyStats } from "@/_generated/prisma";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { RatingsMetrics, RatingsTypes } from "../_domain/ratings_list_items";
import { getStartOfToday } from "@/shared/lib/date";
import { getPeriodRange } from "../_vm/get_period_range";

export class StatisticRepository {
  async getUserCountsInFractions() {
    try {
      const adepts_count = await dataBase.profile.count({
        where: {
          fraktion: Fraktion.ADEPT,
        },
      });
      const novices_count = await dataBase.profile.count({
        where: {
          fraktion: Fraktion.NOVICE,
        },
      });
      return {
        adepts_count: adepts_count,
        novices_count: novices_count,
      };
    } catch (error) {
      console.error("not found users", error);
      return null;
    }
  }

  async getRating({
    ratingType,
    metric,
    tx,
    page = 1,
    pageSize = 10,
  }: {
    ratingType: RatingsTypes;
    metric: RatingsMetrics;
    tx?: TransactionType;
    page?: number;
    pageSize?: number;
  }) {
    const db = tx ?? dataBase;
    const isOverall = ratingType === "overall";

    if (isOverall) {
      // Берём пользователей с их profile / statistic
      const users = await db.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: metric === "exp" ? { profile: { exp: "desc" } } : { user_statistic: { [metric]: "desc" } },
        include: {
          profile: true,
          user_statistic: true,
        },
      });

      const formatted = users.map((user) => ({
        amount: metric === "exp" ? (user.profile?.exp ?? 0) : (user.user_statistic?.[metric] ?? 0),
        user,
      }));

      const total = await db.user.count();

      return {
        type: ratingType,
        metric,
        total,
        pages: Math.ceil(total / pageSize),
        page,
        pageSize,
        data: formatted,
      };
    }

    // Для периодических рейтингов
    const range = getPeriodRange(ratingType);
    if (!range) {
      return {
        type: ratingType,
        metric,
        total: 0,
        pages: 0,
        page,
        pageSize,
        data: [],
      };
    }
    const { start, end } = range;

    const grouped = await db.userDailyStats.groupBy({
      by: ["userId"],
      where: { date: { gte: start, lte: end } },
      _sum: { [metric]: true },
      orderBy: { _sum: { [metric]: "desc" } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalUsers = await db.userDailyStats.groupBy({
      by: ["userId"],
      where: { date: { gte: start, lte: end } },
      _sum: { [metric]: true },
    });

    const detailedUsers = await Promise.all(
      grouped.map(async (u) => ({
        amount: u._sum[metric] ?? 0,
        user: await db.user.findUnique({
          where: { id: u.userId },
          select: {
            id: true,
            profile: { select: { nikname: true, avatar_url: true } },
          },
        }),
      })),
    );

    return {
      type: ratingType,
      metric,
      total: totalUsers.length,
      pages: Math.ceil(totalUsers.length / pageSize),
      page,
      pageSize,
      data: detailedUsers,
    };
  }

  async getUserDailyStats({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const today = getStartOfToday();
    try {
      const stat = await db_client.userDailyStats.findUnique({
        where: {
          userId_date: {
            userId: userId,
            date: today,
          },
        },
      });
      return stat;
    } catch (error) {
      console.error("getUserDailyStats error", error);
      return null;
    }
  }
  async updateUserDailyStats({
    data,
    userId,
    tx,
  }: {
    data: Partial<UserDailyStats>;
    userId: string;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    const today = getStartOfToday();
    try {
      const stat = await db_client.userDailyStats.upsert({
        where: { userId_date: { userId: userId, date: today } },
        update: data,
        create: {
          userId,
          date: today,
          ...data,
        },
      });
      return stat;
    } catch (error) {
      console.error("updateDailyStats error", error);
      return null;
    }
  }
}

export const statisticRepository = new StatisticRepository();
