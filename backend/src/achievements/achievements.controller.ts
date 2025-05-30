import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";
import { AchievementsService } from "./achievements.service";

@ApiTags("achievements")
@Controller("achievements")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: "모든 업적 조회" })
  @ApiResponse({ status: 200, description: "모든 업적 목록을 반환합니다." })
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 업적 조회" })
  @ApiResponse({ status: 200, description: "특정 업적 정보를 반환합니다." })
  findOne(@Param("id") id: string) {
    return this.achievementsService.findOne(id);
  }

  @Get("users/:userId")
  @ApiOperation({ summary: "사용자의 업적 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자가 획득한 업적 목록을 반환합니다.",
  })
  findByUser(@Param("userId") userId: string) {
    return this.achievementsService.findByUser(userId);
  }

  @Get("check/:userId")
  @ApiOperation({ summary: "업적 달성 확인" })
  @ApiResponse({
    status: 200,
    description: "새로 달성한 업적 목록을 반환합니다.",
  })
  checkAchievements(@Param("userId") userId: string) {
    return this.achievementsService.checkAndAwardAchievements(userId);
  }
}
