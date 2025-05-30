import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";
import { Achievement, AchievementSchema } from "./schemas/achievement.schema";
import { UsersModule } from "../users/users.module";
import { ChallengesModule } from "../challenges/challenges.module";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
    ]),
    UsersModule,
    ChallengesModule,
    PostsModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
