import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { RoutinesService } from "./routines.service";
import { CreateRoutineDto } from "./dto/create-routine.dto";
import { UpdateRoutineDto } from "./dto/update-routine.dto";
import { Routine } from "./schemas/routine.schema";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { FileUploadService } from "../common/services/file-upload.service";

@ApiTags("routines")
@Controller("routines")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class RoutinesController {
  constructor(
    private readonly routinesService: RoutinesService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post()
  @ApiOperation({ summary: "새로운 루틴 생성" })
  @ApiResponse({
    status: 201,
    description: "루틴이 성공적으로 생성됨",
    type: Routine,
  })
  create(@Body() createRoutineDto: CreateRoutineDto, @Request() req) {
    return this.routinesService.create(createRoutineDto, req.user.uid);
  }

  @Get()
  @ApiOperation({ summary: "사용자의 모든 루틴 조회" })
  @ApiResponse({ status: 200, description: "루틴 목록 반환", type: [Routine] })
  findAll(@Request() req) {
    return this.routinesService.findAll(req.user.uid);
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 루틴 조회" })
  @ApiResponse({ status: 200, description: "루틴 정보 반환", type: Routine })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  findOne(@Param("id") id: string, @Request() req) {
    return this.routinesService.findOne(id, req.user.uid);
  }

  @Patch(":id")
  @ApiOperation({ summary: "루틴 정보 업데이트" })
  @ApiResponse({
    status: 200,
    description: "루틴이 성공적으로 업데이트됨",
    type: Routine,
  })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  update(
    @Param("id") id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @Request() req
  ) {
    return this.routinesService.update(id, updateRoutineDto, req.user.uid);
  }

  @Delete(":id")
  @ApiOperation({ summary: "루틴 삭제" })
  @ApiResponse({ status: 200, description: "루틴이 성공적으로 삭제됨" })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  remove(@Param("id") id: string, @Request() req) {
    return this.routinesService.remove(id, req.user.uid);
  }

  @Put(":id/toggle")
  @ApiOperation({ summary: "루틴 활성화/비활성화 토글" })
  toggleActive(@Param("id") id: string) {
    return this.routinesService.toggleActive(id);
  }

  @Post(":id/exercises")
  @ApiOperation({ summary: "운동 추가" })
  addExercise(
    @Param("id") id: string,
    @Body() exercise: Routine["exercises"][0]
  ) {
    return this.routinesService.addExercise(id, exercise);
  }

  @Delete(":id/exercises/:index")
  @ApiOperation({ summary: "운동 삭제" })
  removeExercise(@Param("id") id: string, @Param("index") index: string) {
    return this.routinesService.removeExercise(id, parseInt(index));
  }

  @Put(":id/schedule")
  @ApiOperation({ summary: "루틴 일정 수정" })
  updateSchedule(
    @Param("id") id: string,
    @Body() schedule: Routine["schedule"]
  ) {
    return this.routinesService.updateSchedule(id, schedule);
  }

  @Post(":id/join")
  @ApiOperation({ summary: "루틴 참여" })
  @ApiResponse({
    status: 200,
    description: "루틴 참여 성공",
    type: Routine,
  })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  @ApiResponse({
    status: 400,
    description: "이미 참여 중이거나 참가자 수 초과",
  })
  joinRoutine(@Param("id") id: string, @Request() req) {
    return this.routinesService.joinRoutine(id, req.user.uid);
  }

  @Delete(":id/leave")
  @ApiOperation({ summary: "루틴 탈퇴" })
  @ApiResponse({
    status: 200,
    description: "루틴 탈퇴 성공",
    type: Routine,
  })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  leaveRoutine(@Param("id") id: string, @Request() req) {
    return this.routinesService.leaveRoutine(id, req.user.uid);
  }

  @Patch(":id/progress")
  @ApiOperation({ summary: "루틴 진행도 업데이트" })
  @ApiResponse({
    status: 200,
    description: "진행도 업데이트 성공",
    type: Routine,
  })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  @ApiResponse({ status: 400, description: "참여 중인 루틴이 아님" })
  updateProgress(
    @Param("id") id: string,
    @Body("progress") progress: number,
    @Request() req
  ) {
    return this.routinesService.updateProgress(id, req.user.uid, progress);
  }

  @Post(":id/certification")
  @ApiOperation({ summary: "루틴 인증 이미지 업로드" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiResponse({
    status: 200,
    description: "인증 이미지 업로드 성공",
    type: Routine,
  })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  @ApiResponse({ status: 400, description: "참여 중인 루틴이 아님" })
  async addCertification(
    @Param("id") id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Request() req
  ) {
    const imageUrl = await this.fileUploadService.uploadFile(
      file,
      `routines/${id}/certifications/${req.user.uid}`
    );
    return this.routinesService.addCertification(id, req.user.uid, imageUrl);
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "루틴 통계 조회" })
  @ApiResponse({ status: 200, description: "루틴 통계 반환" })
  @ApiResponse({ status: 404, description: "루틴을 찾을 수 없음" })
  getRoutineStats(@Param("id") id: string) {
    return this.routinesService.getRoutineStats(id);
  }
}
