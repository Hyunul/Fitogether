import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Achievement, AchievementDocument } from "./schemas/achievement.schema";
import { UsersService } from "../users/users.service";
import { ChallengesService } from "../challenges/challenges.service";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    private readonly usersService: UsersService,
    private readonly challengesService: ChallengesService,
    private readonly postsService: PostsService
  ) {}

  async findAll(): Promise<Achievement[]> {
    return this.achievementModel.find().exec();
  }

  async findOne(id: string): Promise<Achievement> {
    return this.achievementModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<Achievement[]> {
    return this.achievementModel.find({ unlockedBy: userId }).exec();
  }

  async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    const user = await this.usersService.findOne(userId);
    const challenges = await this.challengesService.findAll();
    const posts = await this.postsService.findAll();
    const achievements = await this.findAll();

    const userChallenges = challenges.filter((c) =>
      c.participants.includes(userId)
    );
    const userPosts = posts.filter((p) => p.author.toString() === userId);

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (achievement.unlockedBy.includes(userId)) {
        continue;
      }

      const isUnlocked = await this.checkAchievementUnlock(
        achievement,
        user,
        userChallenges,
        userPosts
      );

      if (isUnlocked) {
        achievement.unlockedBy.push(userId);
        await achievement.save();
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  private async checkAchievementUnlock(
    achievement: Achievement,
    user: any,
    userChallenges: any[],
    userPosts: any[]
  ): Promise<boolean> {
    switch (achievement.type) {
      case "challenge_completion":
        return this.checkChallengeCompletionAchievement(
          achievement,
          userChallenges
        );
      case "post_count":
        return this.checkPostCountAchievement(achievement, userPosts);
      case "streak":
        return this.checkStreakAchievement(achievement, userChallenges);
      case "social":
        return this.checkSocialAchievement(achievement, userPosts);
      default:
        return false;
    }
  }

  private checkChallengeCompletionAchievement(
    achievement: Achievement,
    userChallenges: any[]
  ): boolean {
    const completedChallenges = userChallenges.filter(
      (c) => c.progress[userChallenges[0].participants[0]] === 100
    );
    return completedChallenges.length >= achievement.requirement;
  }

  private checkPostCountAchievement(
    achievement: Achievement,
    userPosts: any[]
  ): boolean {
    return userPosts.length >= achievement.requirement;
  }

  private checkStreakAchievement(
    achievement: Achievement,
    userChallenges: any[]
  ): boolean {
    let currentStreak = 0;
    let maxStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const hasActivity = userChallenges.some((c) => {
        const lastActivity = new Date(c.updatedAt);
        lastActivity.setHours(0, 0, 0, 0);
        return lastActivity.getTime() === date.getTime();
      });

      if (hasActivity) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak >= achievement.requirement;
  }

  private checkSocialAchievement(
    achievement: Achievement,
    userPosts: any[]
  ): boolean {
    const totalLikes = userPosts.reduce(
      (sum, post) => sum + (post.likes?.length || 0),
      0
    );
    const totalComments = userPosts.reduce(
      (sum, post) => sum + (post.comments?.length || 0),
      0
    );

    switch (achievement.category) {
      case "likes":
        return totalLikes >= achievement.requirement;
      case "comments":
        return totalComments >= achievement.requirement;
      case "engagement":
        return totalLikes + totalComments >= achievement.requirement;
      default:
        return false;
    }
  }
}
