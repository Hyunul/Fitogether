import { Injectable } from "@nestjs/common";
import { Report } from "../schemas/report.schema";

@Injectable()
export class ChartDataService {
  convertToWorkoutChartData(report: Report) {
    return {
      dailyStats: report.dailyStats.map((stat) => ({
        date: stat.date,
        workoutCount: stat.workoutCount,
        totalMinutes: stat.totalMinutes,
        totalCalories: stat.totalCalories,
      })),
      workoutDistribution: report.workoutDistribution.map((dist) => ({
        type: dist.type,
        count: dist.count,
        percentage: dist.percentage,
      })),
      summary: {
        totalWorkouts: report.workoutStats.totalWorkouts,
        totalMinutes: report.workoutStats.totalMinutes,
        totalCalories: report.workoutStats.totalCalories,
        averageDuration: report.workoutStats.averageDuration,
        averageCalories: report.workoutStats.averageCalories,
      },
    };
  }

  convertToChallengeChartData(report: Report) {
    return {
      challengeProgress: {
        total: report.challengeStats.totalChallenges,
        completed: report.challengeStats.completedChallenges,
        inProgress: report.challengeStats.inProgressChallenges,
        averageProgress: report.challengeStats.averageProgress,
      },
      dailyProgress: report.dailyStats.map((stat) => ({
        date: stat.date,
        progress: stat.workoutCount > 0 ? 100 : 0, // 임시 계산식
      })),
    };
  }

  convertToCombinedChartData(report: Report) {
    return {
      workoutTrend: report.dailyStats.map((stat) => ({
        date: stat.date,
        workoutCount: stat.workoutCount,
        totalMinutes: stat.totalMinutes,
        totalCalories: stat.totalCalories,
      })),
      challengeProgress: {
        completed: report.challengeStats.completedChallenges,
        inProgress: report.challengeStats.inProgressChallenges,
        averageProgress: report.challengeStats.averageProgress,
      },
      workoutDistribution: report.workoutDistribution.map((dist) => ({
        type: dist.type,
        percentage: dist.percentage,
      })),
    };
  }
}
