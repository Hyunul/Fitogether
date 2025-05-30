import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Delete,
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
import { ChallengesService } from "./challenges.service";
import { CreateChallengeDto } from "./dto/create-challenge.dto";
import { Challenge } from "./schemas/challenge.schema";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { FileUploadService } from "../common/services/file-upload.service";

@ApiTags("challenges")
@Controller("challenges")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(
    private readonly challengesService: ChallengesService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post()
  @ApiOperation({ summary: "새로운 챌린지 생성" })
  @ApiResponse({
    status: 201,
    description: "챌린지가 성공적으로 생성됨",
    type: Challenge,
  })
  create(@Body() createChallengeDto: CreateChallengeDto, @Request() req) {
    return this.challengesService.create(createChallengeDto, req.user.uid);
  }

  @Get()
  @ApiOperation({ summary: "모든 챌린지 조회" })
  @ApiResponse({
    status: 200,
    description: "챌린지 목록 반환",
    type: [Challenge],
  })
  findAll() {
    return this.challengesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 챌린지 조회" })
  @ApiResponse({
    status: 200,
    description: "챌린지 정보 반환",
    type: Challenge,
  })
  @ApiResponse({ status: 404, description: "챌린지를 찾을 수 없음" })
  findOne(@Param("id") id: string) {
    return this.challengesService.findOne(id);
  }

  @Post(":id/join")
  @ApiOperation({ summary: "챌린지 참여" })
  @ApiResponse({
    status: 200,
    description: "챌린지 참여 성공",
    type: Challenge,
  })
  @ApiResponse({ status: 404, description: "챌린지를 찾을 수 없음" })
  @ApiResponse({
    status: 400,
    description: "이미 참여 중이거나 참가자 수 초과",
  })
  joinChallenge(@Param("id") id: string, @Request() req) {
    return this.challengesService.joinChallenge(id, req.user.uid);
  }

  @Delete(":id/leave")
  @ApiOperation({ summary: "챌린지 탈퇴" })
  @ApiResponse({
    status: 200,
    description: "챌린지 탈퇴 성공",
    type: Challenge,
  })
  @ApiResponse({ status: 404, description: "챌린지를 찾을 수 없음" })
  leaveChallenge(@Param("id") id: string, @Request() req) {
    return this.challengesService.leaveChallenge(id, req.user.uid);
  }

  @Patch(":id/progress")
  @ApiOperation({ summary: "챌린지 진행도 업데이트" })
  @ApiResponse({
    status: 200,
    description: "진행도 업데이트 성공",
    type: Challenge,
  })
  @ApiResponse({ status: 404, description: "챌린지를 찾을 수 없음" })
  @ApiResponse({ status: 400, description: "참여 중인 챌린지가 아님" })
  updateProgress(
    @Param("id") id: string,
    @Body("progress") progress: number,
    @Request() req
  ) {
    return this.challengesService.updateProgress(id, req.user.uid, progress);
  }

  @Post(":id/certification")
  @ApiOperation({ summary: "챌린지 인증 이미지 업로드" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiResponse({
    status: 200,
    description: "인증 이미지 업로드 성공",
    type: Challenge,
  })
  @ApiResponse({ status: 404, description: "챌린지를 찾을 수 없음" })
  @ApiResponse({ status: 400, description: "참여 중인 챌린지가 아님" })
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
      `challenges/${id}/certifications/${req.user.uid}`
    );
    return this.challengesService.addCertification(id, req.user.uid, imageUrl);
  }

  @Get(":id/leaderboard")
  @ApiOperation({ summary: "챌린지 랭킹 조회" })
  @ApiResponse({ status: 200, description: "랭킹 목록 반환" })
  @ApiResponse({ status: 404, description: "챌린지를 찾을 수 없음" })
  getLeaderboard(@Param("id") id: string) {
    return this.challengesService.getLeaderboard(id);
  }
}
