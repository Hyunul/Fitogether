import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ChallengesService } from "../challenges/challenges.service";
import { PostsService } from "../posts/posts.service";

export interface UserStatistics {
  totalChallenges: number;
  completedChallenges: number;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  averageProgress: number;
  streakDays: number;
  achievements: {
    total: number;
    recent: any[];
  };
}

export interface ChallengeStatistics {
  totalParticipants: number;
  averageProgress: number;
  completionRate: number;
  activeParticipants: number;
  categoryDistribution: {
    category: string;
    count: number;
  }[];
  progressDistribution: {
    range: string;
    count: number;
  }[];
}

export interface ActivityStatistics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  engagementRate: number;
  topCategories: {
    category: string;
    count: number;
  }[];
  userGrowth: {
    date: Date;
    count: number;
  }[];
}

@Injectable()
export class StatisticsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly challengesService: ChallengesService,
    private readonly postsService: PostsService
  ) {}

  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const user = await this.usersService.findOne(userId);
    const challenges = await this.challengesService.findAll();
    const posts = await this.postsService.findAll();

    const userChallenges = challenges.filter((c) =>
      c.participants.includes(userId)
    );
    const userPosts = posts.filter((p) => p.author.toString() === userId);

    const completedChallenges = userChallenges.filter(
      (c) => c.progress[userId] === 100
    );

    const totalLikes = userPosts.reduce(
      (sum, post) => sum + (post.likes?.length || 0),
      0
    );

    const totalComments = userPosts.reduce(
      (sum, post) => sum + (post.comments?.length || 0),
      0
    );

    const averageProgress =
      userChallenges.length > 0
        ? userChallenges.reduce(
            (sum, c) => sum + (c.progress[userId] || 0),
            0
          ) / userChallenges.length
        : 0;

    // 스트릭 계산 로직 (연속 참여 일수)
    const streakDays = this.calculateStreakDays(userChallenges);

    return {
      totalChallenges: userChallenges.length,
      completedChallenges: completedChallenges.length,
      totalPosts: userPosts.length,
      totalLikes,
      totalComments,
      averageProgress,
      streakDays,
      achievements: {
        total: user.achievements?.length || 0,
        recent: user.achievements?.slice(-5) || [],
      },
    };
  }

  async getChallengeStatistics(
    challengeId: string
  ): Promise<ChallengeStatistics> {
    const challenge = await this.challengesService.findOne(challengeId);
    const participants = challenge.participants;

    const progressValues = participants.map((p) => challenge.progress[p] || 0);

    const averageProgress =
      progressValues.length > 0
        ? progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length
        : 0;

    const completedParticipants = progressValues.filter(
      (p) => p === 100
    ).length;
    const completionRate =
      participants.length > 0
        ? (completedParticipants / participants.length) * 100
        : 0;

    const activeParticipants = progressValues.filter((p) => p > 0).length;

    // 카테고리 분포 계산
    const categoryDistribution = this.calculateCategoryDistribution(challenge);

    // 진행도 분포 계산
    const progressDistribution =
      this.calculateProgressDistribution(progressValues);

    return {
      totalParticipants: participants.length,
      averageProgress,
      completionRate,
      activeParticipants,
      categoryDistribution,
      progressDistribution,
    };
  }

  async getActivityStatistics(): Promise<ActivityStatistics> {
    const users = await this.usersService.findAll();
    const challenges = await this.challengesService.findAll();
    const posts = await this.postsService.findAll();

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 활성 사용자 계산
    const dailyActiveUsers = this.calculateActiveUsers(users, oneDayAgo);
    const weeklyActiveUsers = this.calculateActiveUsers(users, oneWeekAgo);
    const monthlyActiveUsers = this.calculateActiveUsers(users, oneMonthAgo);

    const totalPosts = posts.length;
    const totalComments = posts.reduce(
      (sum, post) => sum + (post.comments?.length || 0),
      0
    );
    const totalLikes = posts.reduce(
      (sum, post) => sum + (post.likes?.length || 0),
      0
    );

    const engagementRate =
      users.length > 0
        ? ((totalLikes + totalComments) / (users.length * totalPosts)) * 100
        : 0;

    // 상위 카테고리 계산
    const topCategories = this.calculateTopCategories(challenges);

    // 사용자 성장 추이 계산
    const userGrowth = this.calculateUserGrowth(users);

    return {
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      totalPosts,
      totalComments,
      totalLikes,
      engagementRate,
      topCategories,
      userGrowth,
    };
  }

  private calculateStreakDays(challenges: any[]): number {
    // 연속 참여 일수 계산 로직
    let streak = 0;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const hasActivity = challenges.some((c) => {
        const lastActivity = new Date(c.updatedAt);
        lastActivity.setHours(0, 0, 0, 0);
        return lastActivity.getTime() === date.getTime();
      });

      if (hasActivity) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateCategoryDistribution(challenge: any) {
    const categories = challenge.categories || [];
    return categories.map((category) => ({
      category,
      count: 1,
    }));
  }

  private calculateProgressDistribution(progressValues: number[]) {
    const ranges = [
      { min: 0, max: 20, label: "0-20%" },
      { min: 21, max: 40, label: "21-40%" },
      { min: 41, max: 60, label: "41-60%" },
      { min: 61, max: 80, label: "61-80%" },
      { min: 81, max: 100, label: "81-100%" },
    ];

    return ranges.map((range) => ({
      range: range.label,
      count: progressValues.filter((p) => p >= range.min && p <= range.max)
        .length,
    }));
  }

  private calculateActiveUsers(users: any[], since: Date) {
    return users.filter((user) => {
      const lastActivity = new Date(user.lastActivityAt || user.createdAt);
      return lastActivity >= since;
    }).length;
  }

  private calculateTopCategories(challenges: any[]) {
    const categoryCount = new Map<string, number>();

    challenges.forEach((challenge) => {
      const categories = challenge.categories || [];
      categories.forEach((category) => {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    });

    return Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateUserGrowth(users: any[]) {
    const growth = new Map<string, number>();
    const now = new Date();

    // 최근 30일 동안의 일별 사용자 수 계산
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const count = users.filter((user) => {
        const createdAt = new Date(user.createdAt);
        return createdAt.toISOString().split("T")[0] === dateStr;
      }).length;

      growth.set(dateStr, count);
    }

    return Array.from(growth.entries())
      .map(([date, count]) => ({
        date: new Date(date),
        count,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
