import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { RoutinesModule } from "./routines/routines.module";
import { ChallengesModule } from "./challenges/challenges.module";
import { ReportsModule } from "./reports/reports.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    RoutinesModule,
    ChallengesModule,
    ReportsModule,
    NotificationsModule,
    CommonModule,
  ],
})
export class AppModule {}
