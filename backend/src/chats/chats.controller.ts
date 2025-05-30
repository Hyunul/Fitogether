import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { User } from "../auth/user.decorator";
import { ChatsService } from "./chats.service";

@ApiTags("chats")
@Controller("chats")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post("direct/:userId")
  @ApiOperation({ summary: "1:1 채팅방 생성" })
  @ApiResponse({ status: 201, description: "채팅방이 생성되었습니다." })
  createDirectChat(
    @User("uid") userId: string,
    @Param("userId") otherUserId: string
  ) {
    return this.chatsService.createDirectChat(userId, otherUserId);
  }

  @Post("group")
  @ApiOperation({ summary: "그룹 채팅방 생성" })
  @ApiResponse({ status: 201, description: "채팅방이 생성되었습니다." })
  createGroupChat(
    @Body("name") name: string,
    @Body("participants") participants: string[]
  ) {
    return this.chatsService.createGroupChat(name, participants);
  }

  @Post("challenge/:challengeId")
  @ApiOperation({ summary: "챌린지 채팅방 생성" })
  @ApiResponse({ status: 201, description: "채팅방이 생성되었습니다." })
  createChallengeChat(
    @Param("challengeId") challengeId: string,
    @Body("participants") participants: string[]
  ) {
    return this.chatsService.createChallengeChat(challengeId, participants);
  }

  @Get()
  @ApiOperation({ summary: "사용자의 채팅방 목록 조회" })
  @ApiResponse({ status: 200, description: "채팅방 목록을 반환합니다." })
  findAll(@User("uid") userId: string) {
    return this.chatsService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 채팅방 조회" })
  @ApiResponse({ status: 200, description: "채팅방 정보를 반환합니다." })
  findOne(@Param("id") id: string) {
    return this.chatsService.findOne(id);
  }

  @Put(":id/participants")
  @ApiOperation({ summary: "채팅방 참가자 추가" })
  @ApiResponse({ status: 200, description: "참가자가 추가되었습니다." })
  addParticipant(@Param("id") id: string, @Body("userId") userId: string) {
    return this.chatsService.addParticipant(id, userId);
  }

  @Delete(":id/participants/:userId")
  @ApiOperation({ summary: "채팅방 참가자 제거" })
  @ApiResponse({ status: 200, description: "참가자가 제거되었습니다." })
  removeParticipant(@Param("id") id: string, @Param("userId") userId: string) {
    return this.chatsService.removeParticipant(id, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "채팅방 삭제" })
  @ApiResponse({ status: 200, description: "채팅방이 삭제되었습니다." })
  delete(@Param("id") id: string, @User("uid") userId: string) {
    return this.chatsService.delete(id, userId);
  }
}
