import { UserStatistic } from "@/_generated/prisma/client";
import { statisticRepository, StatisticRepository } from "@/entities/statistics/_repositories/statistic_repository";
import { TransactionType } from "@/shared/connect/db_connect";

export class StatisticService {
  constructor(private statisticRepo: StatisticRepository) {}

  async udateUserStatistics({
    data,
    userId,
    tx,
  }: {
    data: Partial<UserStatistic>;
    userId: string;
    tx?: TransactionType;
  }) {
    try {
      const updated_overall_stats = await this.statisticRepo.updateUserOverallStats({
        userId,
        tx,
        data,
      });
      if (!updated_overall_stats) throw new Error("Cannot update overall stat");
      const updated_daily_stats = await this.statisticRepo.updateUserDailyStats({
        userId,
        tx,
        data,
      });
      if (!updated_daily_stats) throw new Error("Cannot update daily stat");
      return { updated: true };
    } catch (error) {
      console.error("udateUserStatistics error", error);
      throw new Error("udateUserStatistics error");
    }
  }
}

export const statisticService = new StatisticService(statisticRepository);
