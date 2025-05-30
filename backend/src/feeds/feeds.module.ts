import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedsController } from "./feeds.controller";
import { FeedsService } from "./feeds.service";
import { Feed, FeedSchema } from "./schemas/feed.schema";
import { CertificationsModule } from "../certifications/certifications.module";
import { ChallengesModule } from "../challenges/challenges.module";
import { RoutinesModule } from "../routines/routines.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
    CertificationsModule,
    ChallengesModule,
    RoutinesModule,
  ],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
