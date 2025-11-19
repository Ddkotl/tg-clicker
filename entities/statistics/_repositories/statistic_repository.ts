import { Fraktion } from "@/_generated/prisma";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { OverallRatingsMAP_KEYS } from "../_domain/ratings_list_items";

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

  async getExpRating({ tx, page = 1, pageSize = 10 }: { tx?: TransactionType; page?: number; pageSize?: number }) {
    const db = tx ?? dataBase;
    const users = await db.profile.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ lvl: "desc" }, { exp: "desc" }],
      select: {
        lvl: true,
        exp: true,
        user: {
          select: {
            id: true,
            profile: { select: { avatar_url: true, nikname: true } },
          },
        },
      },
    });

    const total = await db.profile.count();

    return {
      rating_type: OverallRatingsMAP_KEYS.exp,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: users,
    };
  }

  async getMeditationRating({
    tx,
    page = 1,
    pageSize = 10,
  }: {
    tx?: TransactionType;
    page?: number;
    pageSize?: number;
  }) {
    const db_client = tx ? tx : dataBase;
    const users = db_client.userStatistic.findMany({
      skip: pageSize * (page - 1),
      take: pageSize,
      orderBy: { meditated_hours: "desc" },
      select: {
        meditated_hours: true,
        user: {
          select: {
            id: true,
            profile: {
              select: { avatar_url: true, nikname: true },
            },
          },
        },
      },
    });
    const total = await db_client.profile.count();
    return {
      rating_type: OverallRatingsMAP_KEYS.meditation,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: users,
    };
  }

  async getSpiritPathRating({
    tx,
    page = 1,
    pageSize = 10,
  }: {
    tx?: TransactionType;
    page?: number;
    pageSize?: number;
  }) {
    const db_client = tx ? tx : dataBase;
    const users = db_client.userStatistic.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { spirit_path_minutes: "desc" },
      select: {
        spirit_path_minutes: true,
        user: {
          select: {
            id: true,
            profile: {
              select: { avatar_url: true, nikname: true },
            },
          },
        },
      },
    });
    const total = await db_client.profile.count();
    return {
      rating_type: OverallRatingsMAP_KEYS.spirit,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: users,
    };
  }

  async getMiningRating({ tx, page = 1, pageSize = 10 }: { tx?: TransactionType; page?: number; pageSize?: number }) {
    const db_client = tx ? tx : dataBase;
    const users = db_client.userStatistic.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { mined_qi_stone: "desc" },
      select: {
        mined_qi_stone: true,
        user: {
          select: {
            id: true,
            profile: {
              select: { avatar_url: true, nikname: true },
            },
          },
        },
      },
    });
    const total = await db_client.profile.count();
    return {
      rating_type: OverallRatingsMAP_KEYS.mining,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: users,
    };
  }

  async getWinsRating({ tx, page = 1, pageSize = 10 }: { tx?: TransactionType; page?: number; pageSize?: number }) {
    const db_client = tx ? tx : dataBase;
    const users = db_client.userStatistic.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { fights_wins: "desc" },
      select: {
        fights_wins: true,
        user: {
          select: {
            id: true,
            profile: {
              select: { avatar_url: true, nikname: true },
            },
          },
        },
      },
    });
    const total = await db_client.profile.count();
    return {
      rating_type: OverallRatingsMAP_KEYS.wins,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: users,
    };
  }
}

export const statisticRepository = new StatisticRepository();
