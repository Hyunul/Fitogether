import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";
import { PointsService } from "./points.service";

@ApiTags("points")
@Controller("points")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get()
  @ApiOperation({ summary: "포인트 정보 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자의 포인트 정보를 반환합니다.",
  })
  getUserPoints(@User() user: any) {
    return this.pointsService.getUserPoints(user._id);
  }

  @Get("history")
  @ApiOperation({ summary: "포인트 내역 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자의 포인트 내역을 반환합니다.",
  })
  getPointHistory(
    @User() user: any,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.pointsService.getPointHistory(user._id, page, limit);
  }
}
