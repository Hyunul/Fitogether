import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChallengesController } from "./challenges.controller";
import { ChallengesService } from "./challenges.service";
import { Challenge, ChallengeSchema } from "./schemas/challenge.schema";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    CommonModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
