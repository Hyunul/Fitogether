import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Patch,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { Report } from "./schemas/report.schema";
import { CreateReportDto } from "./dto/create-report.dto";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";

@ApiTags("reports")
@Controller("reports")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: "새로운 리포트 생성" })
  @ApiResponse({
    status: 201,
    description: "리포트가 성공적으로 생성됨",
    type: Report,
  })
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportsService.create(createReportDto, req.user.uid);
  }

  @Get()
  @ApiOperation({ summary: "사용자의 모든 리포트 조회" })
  @ApiResponse({ status: 200, description: "리포트 목록 반환", type: [Report] })
  findAll(@Request() req) {
    return this.reportsService.findAll(req.user.uid);
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 리포트 조회" })
  @ApiResponse({ status: 200, description: "리포트 정보 반환", type: Report })
  @ApiResponse({ status: 404, description: "리포트를 찾을 수 없음" })
  findOne(@Param("id") id: string, @Request() req) {
    return this.reportsService.findOne(id, req.user.uid);
  }

  @Put(":id")
  @ApiOperation({ summary: "리포트 정보 수정" })
  update(@Param("id") id: string, @Body() updateReportDto: Partial<Report>) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "리포트 삭제" })
  remove(@Param("id") id: string) {
    return this.reportsService.remove(id);
  }

  @Put(":id/status")
  @ApiOperation({ summary: "리포트 상태 업데이트" })
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: "pending" | "completed"
  ) {
    return this.reportsService.updateStatus(id, status);
  }

  @Put(":id/stats")
  @ApiOperation({ summary: "리포트 통계 업데이트" })
  updateStats(@Param("id") id: string, @Body() stats: Report["stats"]) {
    return this.reportsService.updateStats(id, stats);
  }

  @Post("generate")
  @ApiOperation({ summary: "리포트 생성" })
  @ApiResponse({
    status: 201,
    description: "리포트가 성공적으로 생성되었습니다.",
  })
  generateReport(
    @User("uid") userId: string,
    @Body("type") type: "DAILY" | "WEEKLY" | "MONTHLY",
    @Body("startDate") startDate: Date,
    @Body("endDate") endDate: Date
  ) {
    return this.reportsService.generateReport(userId, type, startDate, endDate);
  }

  @Patch(":id/share")
  @ApiOperation({ summary: "리포트 공유 상태 토글" })
  @ApiResponse({
    status: 200,
    description: "리포트 공유 상태가 변경됨",
    type: Report,
  })
  @ApiResponse({ status: 404, description: "리포트를 찾을 수 없음" })
  toggleShare(@Param("id") id: string, @Request() req) {
    return this.reportsService.toggleShare(id, req.user.uid);
  }

  @Get("user/me")
  @ApiOperation({ summary: "사용자의 리포트 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자의 리포트 목록을 반환합니다.",
  })
  findMyReports(
    @User("uid") userId: string,
    @Query("type") type?: "DAILY" | "WEEKLY" | "MONTHLY"
  ) {
    return this.reportsService.findByUser(userId, type);
  }
}
