import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { Report, ReportSchema } from "./schemas/report.schema";
import { WorkoutsModule } from "../workouts/workouts.module";
import { AchievementsModule } from "../achievements/achievements.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    WorkoutsModule,
    AchievementsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
