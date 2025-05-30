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
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { FileUploadService } from "../common/services/file-upload.service";
import { User as UserEntity } from "../auth/user.decorator";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post()
  @ApiOperation({ summary: "새로운 사용자 생성" })
  @ApiResponse({
    status: 201,
    description: "사용자가 성공적으로 생성됨",
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user.uid);
  }

  @Get()
  @ApiOperation({ summary: "모든 사용자 조회" })
  @ApiResponse({ status: 200, description: "사용자 목록 반환", type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 사용자 조회" })
  @ApiResponse({ status: 200, description: "사용자 정보 반환", type: User })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post(":id/profile-image")
  @ApiOperation({ summary: "프로필 이미지 업로드" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(
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
    if (req.user.uid !== id) {
      throw new Error("권한이 없습니다.");
    }

    const imageUrl = await this.fileUploadService.uploadFile(
      file,
      `users/${id}/profile`
    );
    return this.usersService.update(id, { profileImage: imageUrl });
  }

  @Post(":id")
  @ApiOperation({ summary: "사용자 정보 수정" })
  @ApiResponse({
    status: 200,
    description: "사용자 정보가 성공적으로 수정됨",
    type: User,
  })
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    if (req.user.uid !== id) {
      throw new Error("권한이 없습니다.");
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "사용자 삭제" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Post(":id/friends/:friendId")
  @ApiOperation({ summary: "친구 추가" })
  addFriend(@Param("id") id: string, @Param("friendId") friendId: string) {
    return this.usersService.addFriend(id, friendId);
  }

  @Delete(":id/friends/:friendId")
  @ApiOperation({ summary: "친구 삭제" })
  removeFriend(@Param("id") id: string, @Param("friendId") friendId: string) {
    return this.usersService.removeFriend(id, friendId);
  }

  @Post(":id/follow")
  @ApiOperation({ summary: "사용자 팔로우" })
  @ApiResponse({ status: 200, description: "사용자를 팔로우합니다." })
  follow(@User() currentUser: UserEntity, @Param("id") followingId: string) {
    return this.usersService.follow(currentUser._id, followingId);
  }

  @Post(":id/unfollow")
  @ApiOperation({ summary: "사용자 언팔로우" })
  @ApiResponse({ status: 200, description: "사용자를 언팔로우합니다." })
  unfollow(@User() currentUser: UserEntity, @Param("id") followingId: string) {
    return this.usersService.unfollow(currentUser._id, followingId);
  }

  @Get(":id/followers")
  @ApiOperation({ summary: "팔로워 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자의 팔로워 목록을 반환합니다.",
  })
  getFollowers(@Param("id") id: string) {
    return this.usersService.getFollowers(id);
  }

  @Get(":id/following")
  @ApiOperation({ summary: "팔로잉 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자의 팔로잉 목록을 반환합니다.",
  })
  getFollowing(@Param("id") id: string) {
    return this.usersService.getFollowing(id);
  }
}
