import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";
import { StatisticsService } from "./statistics.service";

@ApiTags("statistics")
@Controller("statistics")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get("users/:userId")
  @ApiOperation({ summary: "사용자 통계 조회" })
  @ApiResponse({ status: 200, description: "사용자 통계를 반환합니다." })
  getUserStatistics(@Param("userId") userId: string) {
    return this.statisticsService.getUserStatistics(userId);
  }

  @Get("challenges/:challengeId")
  @ApiOperation({ summary: "챌린지 통계 조회" })
  @ApiResponse({ status: 200, description: "챌린지 통계를 반환합니다." })
  getChallengeStatistics(@Param("challengeId") challengeId: string) {
    return this.statisticsService.getChallengeStatistics(challengeId);
  }

  @Get("activity")
  @ApiOperation({ summary: "활동 통계 조회" })
  @ApiResponse({ status: 200, description: "활동 통계를 반환합니다." })
  getActivityStatistics() {
    return this.statisticsService.getActivityStatistics();
  }
}
