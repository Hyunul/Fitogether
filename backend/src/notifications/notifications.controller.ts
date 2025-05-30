import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
import { NotificationsService } from "./notifications.service";
import { Notification } from "./schemas/notification.schema";

@ApiTags("notifications")
@Controller("notifications")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "알림 목록 조회" })
  @ApiResponse({ status: 200, description: "알림 목록을 반환합니다." })
  findAll(@User() user: any) {
    return this.notificationsService.findAll(user._id);
  }

  @Get("unread/count")
  @ApiOperation({ summary: "읽지 않은 알림 개수 조회" })
  @ApiResponse({
    status: 200,
    description: "읽지 않은 알림 개수를 반환합니다.",
  })
  findUnreadCount(@User("uid") userId: string) {
    return this.notificationsService.findUnreadCount(userId);
  }

  @Post(":id/read")
  @ApiOperation({ summary: "알림 읽음 표시" })
  @ApiResponse({ status: 200, description: "알림을 읽음으로 표시했습니다." })
  markAsRead(@Param("id") id: string, @User() user: any) {
    return this.notificationsService.markAsRead(id);
  }

  @Post("read-all")
  @ApiOperation({ summary: "모든 알림 읽음 표시" })
  @ApiResponse({
    status: 200,
    description: "모든 알림을 읽음으로 표시했습니다.",
  })
  markAllAsRead(@User() user: any) {
    return this.notificationsService.markAllAsRead(user._id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "알림 삭제" })
  @ApiResponse({ status: 200, description: "알림을 삭제합니다." })
  delete(@Param("id") id: string) {
    return this.notificationsService.delete(id);
  }

  @Delete()
  @ApiOperation({ summary: "모든 알림 삭제" })
  @ApiResponse({ status: 200, description: "모든 알림을 삭제합니다." })
  deleteAll(@User() user: any) {
    return this.notificationsService.deleteAll(user._id);
  }
}
