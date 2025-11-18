import { Fraktion } from "@/_generated/prisma";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";

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

  async getOverallRating({ tx }: { tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const users =  db_client.profile.findMany({
      take: 100,
      orderBy: [{ lvl: "desc" }, { exp: "desc" }],
      select: {
        lvl: true,
        exp: true,
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
    return {
      rating_type: "lvl",
      data: users,
    }
  }

  async getMeditationRating({ tx }: { tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const users = db_client.userStatistic.findMany({
      take: 100,
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
    return {
      rating_type: "meditation",
      data: users,
    }
  }

  async getSpiritPathRating({ tx }: { tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const users =  db_client.userStatistic.findMany({
      take: 100,
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
    return {
      rating_type: "spirit_path",
      data: users,
    }
  }

  async getMiningRating({ tx }: { tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const users =  db_client.userStatistic.findMany({
      take: 100,
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
    return {
      rating_type: "mining",
      data: users,
    }
  }

  async getWinsRating({ tx }: { tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const users = db_client.userStatistic.findMany({
      take: 100,
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
    return {
      rating_type: "wins",
      data: users,
    }
  }
}

export const statisticRepository = new StatisticRepository();
