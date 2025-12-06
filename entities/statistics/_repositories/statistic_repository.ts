import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { RatingsMetrics, RatingsTypes } from "../_domain/types";
import { getStartOfToday } from "@/shared/lib/date";
import { getPeriodRange } from "../_vm/get_period_range";
import { Fraktion } from "@/_generated/prisma/enums";
import { UserDailyStats, UserStatistic } from "@/_generated/prisma/client";

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
  async getUserStats({ userId, type, tx }: { userId: string; type: RatingsTypes; tx?: TransactionType }) {
    const db = tx ?? dataBase;

    // 🔹 Общая статистика
    if (type === "overall") {
      try {
        return await db.userStatistic.findUnique({
          where: { userId },
        });
      } catch (error) {
        console.error("getUserStats overall error:", error);
        return null;
      }
    }

    // 🔹 Периоды (day/week/month)
    const range = getPeriodRange(type);
    if (!range) return null;

    const { start, end } = range;

    try {
      const grouped = await db.userDailyStats.groupBy({
        by: ["userId"],
        where: {
          userId,
          date: { gte: start, lte: end },
        },
        _sum: {
          exp: true,
          glory: true,
          meditated_hours: true,
          spirit_path_minutes: true,
          mined_qi_stone: true,
          mined_count: true,
          fights_total: true,
          fights_wins: true,
          qi_looted: true,
          qi_lost: true,
          qi_stone_looted: true,
          qi_stone_lost: true,
          missions: true,
        },
      });

      return grouped.length ? grouped[0]._sum : null;
    } catch (error) {
      console.error("getUserStats period error:", error);
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
      const { exp, fights_total, fights_wins, meditated_hours, mined_count, mined_qi_stone, spirit_path_minutes } =
        data;
      const dataToUpdate: Record<string, object> = {};
      if (exp !== undefined) dataToUpdate.exp = { increment: exp };
      if (fights_total !== undefined) dataToUpdate.fights_total = { increment: fights_total };
      if (fights_wins !== undefined) dataToUpdate.fights_wins = { increment: fights_wins };
      if (meditated_hours !== undefined) dataToUpdate.meditated_hours = { increment: meditated_hours };
      if (mined_count !== undefined) dataToUpdate.mined_count = { increment: mined_count };
      if (mined_qi_stone !== undefined) dataToUpdate.mined_qi_stone = { increment: mined_qi_stone };
      if (spirit_path_minutes !== undefined) dataToUpdate.spirit_path_minutes = { increment: spirit_path_minutes };
      if (Object.keys(dataToUpdate).length === 0) {
        console.warn("⚠️ Нет данных для обновления");
        return null;
      }
      const stat = await db_client.userDailyStats.upsert({
        where: { userId_date: { userId: userId, date: today } },
        update: dataToUpdate,
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
  async updateUserOverallStats({
    data,
    userId,
    tx,
  }: {
    data: Partial<UserStatistic>;
    userId: string;
    tx?: TransactionType;
  }) {
    const db_client = tx ? tx : dataBase;
    try {
      const { exp, fights_total, fights_wins, meditated_hours, mined_count, mined_qi_stone, spirit_path_minutes } =
        data;
      const dataToUpdate: Record<string, object> = {};
      if (exp !== undefined) dataToUpdate.exp = { increment: exp };
      if (fights_total !== undefined) dataToUpdate.fights_total = { increment: fights_total };
      if (fights_wins !== undefined) dataToUpdate.fights_wins = { increment: fights_wins };
      if (meditated_hours !== undefined) dataToUpdate.meditated_hours = { increment: meditated_hours };
      if (mined_count !== undefined) dataToUpdate.mined_count = { increment: mined_count };
      if (mined_qi_stone !== undefined) dataToUpdate.mined_qi_stone = { increment: mined_qi_stone };
      if (spirit_path_minutes !== undefined) dataToUpdate.spirit_path_minutes = { increment: spirit_path_minutes };
      if (Object.keys(dataToUpdate).length === 0) {
        console.warn("⚠️ Нет данных для обновления");
        return null;
      }
      const stat = await db_client.userStatistic.upsert({
        where: { userId: userId },
        update: dataToUpdate,
        create: {
          userId,
          ...data,
        },
      });
      return stat;
    } catch (error) {
      console.error("updateUserOverallStats error", error);
      return null;
    }
  }

  async deleteOldUserDailyStats({ beforeDate, tx }: { beforeDate: Date; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    try {
      await db_client.userDailyStats.deleteMany({
        where: {
          date: { lt: beforeDate },
        },
      });
    } catch (error) {
      console.error("deleteOldUserDailyStats error", error);
    }
  }
}

export const statisticRepository = new StatisticRepository();
