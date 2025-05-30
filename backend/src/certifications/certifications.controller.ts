import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Put,
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";
import { CertificationsService } from "./certifications.service";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { FileUploadService } from "../common/file-upload.service";

@ApiTags("certifications")
@Controller("certifications")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class CertificationsController {
  constructor(
    private readonly certificationsService: CertificationsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post(":routineId")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: "운동 인증 생성" })
  @ApiResponse({
    status: 201,
    description: "인증이 성공적으로 생성되었습니다.",
  })
  async create(
    @Param("routineId") routineId: string,
    @User("uid") userId: string,
    @Body() createCertificationDto: CreateCertificationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      })
    )
    file?: Express.Multer.File
  ) {
    if (file) {
      const imageUrl = await this.fileUploadService.uploadFile(file);
      createCertificationDto.imageUrl = imageUrl;
    }

    return this.certificationsService.create(
      routineId,
      userId,
      createCertificationDto
    );
  }

  @Get("routine/:routineId")
  @ApiOperation({ summary: "루틴의 모든 인증 조회" })
  @ApiResponse({ status: 200, description: "인증 목록을 반환합니다." })
  findAll(@Param("routineId") routineId: string) {
    return this.certificationsService.findAll(routineId);
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 인증 조회" })
  @ApiResponse({ status: 200, description: "인증 정보를 반환합니다." })
  findOne(@Param("id") id: string) {
    return this.certificationsService.findOne(id);
  }

  @Put(":id/like")
  @ApiOperation({ summary: "인증 좋아요 토글" })
  @ApiResponse({ status: 200, description: "좋아요 상태가 변경되었습니다." })
  toggleLike(@Param("id") id: string, @User("uid") userId: string) {
    return this.certificationsService.toggleLike(id, userId);
  }

  @Post(":id/comments")
  @ApiOperation({ summary: "인증에 댓글 추가" })
  @ApiResponse({ status: 201, description: "댓글이 추가되었습니다." })
  addComment(
    @Param("id") id: string,
    @User("uid") userId: string,
    @Body("content") content: string
  ) {
    return this.certificationsService.addComment(id, userId, content);
  }

  @Delete(":id/comments/:commentIndex")
  @ApiOperation({ summary: "인증의 댓글 삭제" })
  @ApiResponse({ status: 200, description: "댓글이 삭제되었습니다." })
  removeComment(
    @Param("id") id: string,
    @Param("commentIndex") commentIndex: number,
    @User("uid") userId: string
  ) {
    return this.certificationsService.removeComment(id, commentIndex, userId);
  }

  @Get("user/:userId/routine/:routineId")
  @ApiOperation({ summary: "사용자의 특정 루틴 인증 조회" })
  @ApiResponse({ status: 200, description: "사용자의 인증 목록을 반환합니다." })
  getUserCertifications(
    @Param("userId") userId: string,
    @Param("routineId") routineId: string
  ) {
    return this.certificationsService.getUserCertifications(userId, routineId);
  }
}
