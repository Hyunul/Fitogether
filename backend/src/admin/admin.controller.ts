import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";
import { AdminService } from "./admin.service";
import { Admin, AdminRole } from "./schemas/admin.schema";

@ApiTags("admin")
@Controller("admin")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: "관리자 생성" })
  @ApiResponse({ status: 201, description: "관리자를 생성합니다." })
  create(@Body() createAdminDto: Partial<Admin>) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: "모든 관리자 조회" })
  @ApiResponse({ status: 200, description: "모든 관리자 목록을 반환합니다." })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 관리자 조회" })
  @ApiResponse({ status: 200, description: "특정 관리자 정보를 반환합니다." })
  findOne(@Param("id") id: string) {
    return this.adminService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "관리자 정보 수정" })
  @ApiResponse({ status: 200, description: "관리자 정보를 수정합니다." })
  update(@Param("id") id: string, @Body() updateAdminDto: Partial<Admin>) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "관리자 삭제" })
  @ApiResponse({ status: 200, description: "관리자를 삭제합니다." })
  remove(@Param("id") id: string) {
    return this.adminService.remove(id);
  }

  @Get("check/:userId")
  @ApiOperation({ summary: "관리자 권한 확인" })
  @ApiResponse({
    status: 200,
    description: "사용자의 관리자 권한을 확인합니다.",
  })
  checkAdmin(@Param("userId") userId: string) {
    return this.adminService.isAdmin(userId);
  }
}
