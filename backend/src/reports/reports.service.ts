import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Report } from "./schemas/report.schema";
import { CreateReportDto } from "./dto/create-report.dto";
import { RoutinesService } from "../routines/routines.service";
import { ChallengesService } from "../challenges/challenges.service";
import { WorkoutsService } from "../workouts/workouts.service";
import { AchievementsService } from "../achievements/achievements.service";

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    private readonly routinesService: RoutinesService,
    private readonly challengesService: ChallengesService,
    private readonly workoutsService: WorkoutsService,
    private readonly achievementsService: AchievementsService
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId: string
  ): Promise<Report> {
    const { startDate, endDate } = createReportDto;

    // 루틴 데이터 조회
    const routines = await this.routinesService.findAll(userId);
    const workouts = routines.flatMap((routine) =>
      routine.exercises.map((exercise) => ({
        date: new Date(startDate),
        type: exercise.name,
        duration:
          (exercise.sets * exercise.reps * (exercise.restTime || 60)) / 60,
        calories: exercise.sets * exercise.reps * 5, // 임시 계산식
      }))
    );

    // 챌린지 데이터 조회
    const challenges = await this.challengesService.findAll();
    const userChallenges = challenges.filter((challenge) =>
      challenge.participants.some((p) => p.userId.toString() === userId)
    );

    // 운동 통계 계산
    const workoutStats = {
      totalWorkouts: workouts.length,
      totalMinutes: workouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
      averageDuration: workouts.length
        ? workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length
        : 0,
      averageCalories: workouts.length
        ? workouts.reduce((sum, w) => sum + w.calories, 0) / workouts.length
        : 0,
    };

    // 챌린지 통계 계산
    const challengeStats = {
      totalChallenges: userChallenges.length,
      completedChallenges: userChallenges.filter(
        (c) =>
          c.participants.find((p) => p.userId.toString() === userId)?.completed
      ).length,
      inProgressChallenges: userChallenges.filter(
        (c) =>
          !c.participants.find((p) => p.userId.toString() === userId)?.completed
      ).length,
      averageProgress: userChallenges.length
        ? userChallenges.reduce((sum, c) => {
            const participant = c.participants.find(
              (p) => p.userId.toString() === userId
            );
            return sum + (participant?.progress || 0);
          }, 0) / userChallenges.length
        : 0,
    };

    // 일별 통계 계산
    const dailyStats = this.calculateDailyStats(workouts, startDate, endDate);

    // 운동 유형 분포 계산
    const workoutDistribution = this.calculateWorkoutDistribution(workouts);

    const createdReport = new this.reportModel({
      ...createReportDto,
      userId,
      workoutStats,
      challengeStats,
      dailyStats,
      workoutDistribution,
    });

    return createdReport.save();
  }

  async findAll(userId: string): Promise<Report[]> {
    return this.reportModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Report> {
    const report = await this.reportModel.findOne({ _id: id, userId }).exec();
    if (!report) {
      throw new NotFoundException(`리포트를 찾을 수 없습니다: ${id}`);
    }
    return report;
  }

  async toggleShare(id: string, userId: string): Promise<Report> {
    const report = await this.reportModel.findOne({ _id: id, userId }).exec();
    if (!report) {
      throw new NotFoundException(`리포트를 찾을 수 없습니다: ${id}`);
    }

    report.isShared = !report.isShared;
    return report.save();
  }

  private calculateDailyStats(workouts: any[], startDate: Date, endDate: Date) {
    const dailyStats = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayWorkouts = workouts.filter(
        (w) => w.date.toDateString() === currentDate.toDateString()
      );

      dailyStats.push({
        date: new Date(currentDate),
        workoutCount: dayWorkouts.length,
        totalMinutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        totalCalories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyStats;
  }

  private calculateWorkoutDistribution(workouts: any[]) {
    const typeCount = workouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {});

    const total = workouts.length;
    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: ((count as number) / total) * 100,
    }));
  }

  async generateReport(
    userId: string,
    type: "DAILY" | "WEEKLY" | "MONTHLY",
    startDate: Date,
    endDate: Date
  ): Promise<Report> {
    // 운동 데이터 조회
    const workouts = await this.workoutsService.findByDateRange(
      userId,
      startDate,
      endDate
    );

    // 요약 정보 생성
    const summary = this.generateSummary(workouts);

    // 운동 상세 정보 생성
    const workoutDetails = this.generateWorkoutDetails(workouts);

    // 분석 정보 생성
    const analysis = await this.generateAnalysis(userId, workouts);

    const report = new this.reportModel({
      userId,
      type,
      startDate,
      endDate,
      summary,
      workoutDetails,
      analysis,
    });

    return report.save();
  }

  private generateSummary(workouts: any[]) {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);

    // 가장 빈번한 운동 찾기
    const exerciseCount = {};
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });
    const mostFrequentExercise =
      Object.entries(exerciseCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "없음";

    // 심박수 통계
    const heartRates = workouts.flatMap((w) => w.heartRates || []);
    const averageHeartRate =
      heartRates.length > 0
        ? heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length
        : 0;
    const maxHeartRate = Math.max(...heartRates, 0);

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      mostFrequentExercise,
      averageHeartRate,
      maxHeartRate,
    };
  }

  private generateWorkoutDetails(workouts: any[]) {
    return workouts.map((workout) => ({
      date: workout.date,
      duration: workout.duration,
      calories: workout.calories,
      exercises: workout.exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      })),
    }));
  }

  private async generateAnalysis(userId: string, workouts: any[]) {
    // 진행률 계산
    const progress = this.calculateProgress(workouts);

    // 달성한 업적 조회
    const achievements = await this.achievementsService.getUserAchievements(
      userId
    );

    // 추천사항 생성
    const recommendations = this.generateRecommendations(workouts);

    return {
      progress,
      achievements: achievements.map((a) => a.name),
      recommendations,
    };
  }

  private calculateProgress(workouts: any[]): number {
    // 목표 대비 진행률 계산 로직
    // 예: 주간 목표 운동 횟수 대비 실제 운동 횟수
    const targetWorkouts = 5; // 예시 목표값
    const actualWorkouts = workouts.length;
    return Math.min((actualWorkouts / targetWorkouts) * 100, 100);
  }

  private generateRecommendations(workouts: any[]): string[] {
    const recommendations = [];

    // 운동 빈도 분석
    if (workouts.length < 3) {
      recommendations.push(
        "운동 빈도를 높여보세요. 주 3회 이상 운동하는 것을 목표로 해보세요."
      );
    }

    // 운동 강도 분석
    const averageIntensity =
      workouts.reduce((sum, w) => sum + w.intensity, 0) / workouts.length;
    if (averageIntensity < 0.6) {
      recommendations.push(
        "운동 강도를 조금 더 높여보세요. 더 효과적인 운동을 위해 강도를 높이는 것이 좋습니다."
      );
    }

    // 운동 다양성 분석
    const uniqueExercises = new Set(
      workouts.flatMap((w) => w.exercises.map((e) => e.name))
    ).size;
    if (uniqueExercises < 5) {
      recommendations.push(
        "다양한 운동을 시도해보세요. 새로운 운동을 추가하면 더 균형 잡힌 운동이 가능합니다."
      );
    }

    return recommendations;
  }

  async findByUser(
    userId: string,
    type?: "DAILY" | "WEEKLY" | "MONTHLY"
  ): Promise<Report[]> {
    const query = { userId };
    if (type) {
      query["type"] = type;
    }
    return this.reportModel.find(query).sort({ startDate: -1 }).exec();
  }
}
