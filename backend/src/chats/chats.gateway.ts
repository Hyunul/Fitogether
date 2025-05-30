import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { ChatsService } from "./chats.service";
import { NotificationsService } from "../notifications/notifications.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Socket> = new Map();

  constructor(
    private readonly chatsService: ChatsService,
    private readonly notificationsService: NotificationsService
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.userSockets.set(userId, client);
      client.join(userId);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.userSockets.delete(userId);
      client.leave(userId);
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @SubscribeMessage("joinChat")
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string
  ) {
    const userId = client.handshake.auth.userId;
    const chat = await this.chatsService.findOne(chatId);

    if (chat && chat.participants.includes(userId)) {
      client.join(chatId);
      return { status: "success", message: "채팅방에 입장했습니다." };
    }

    return { status: "error", message: "채팅방에 입장할 수 없습니다." };
  }

  @UseGuards(FirebaseAuthGuard)
  @SubscribeMessage("leaveChat")
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string
  ) {
    client.leave(chatId);
    return { status: "success", message: "채팅방을 나갔습니다." };
  }

  @UseGuards(FirebaseAuthGuard)
  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      chatId: string;
      content: string;
      type?: "TEXT" | "IMAGE" | "FILE";
      fileUrl?: string;
    }
  ) {
    const userId = client.handshake.auth.userId;
    const { chatId, content, type = "TEXT", fileUrl } = data;

    const chat = await this.chatsService.findOne(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return { status: "error", message: "메시지를 보낼 수 없습니다." };
    }

    const message = await this.chatsService.addMessage(
      chatId,
      userId,
      content,
      type,
      fileUrl
    );

    // 채팅방의 다른 참가자들에게 메시지 전송
    chat.participants.forEach((participantId) => {
      if (participantId.toString() !== userId) {
        // 참가자가 온라인인 경우 실시간으로 메시지 전송
        const participantSocket = this.userSockets.get(
          participantId.toString()
        );
        if (participantSocket) {
          participantSocket.emit("newMessage", {
            chatId,
            message,
          });
        }

        // 참가자가 오프라인인 경우 알림 전송
        this.notificationsService.createSocialNotification(
          participantId.toString(),
          userId,
          "새로운 메시지",
          `${chat.name}에서 새로운 메시지가 도착했습니다.`
        );
      }
    });

    return { status: "success", message };
  }

  @UseGuards(FirebaseAuthGuard)
  @SubscribeMessage("markAsRead")
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string
  ) {
    const userId = client.handshake.auth.userId;
    await this.chatsService.markAsRead(chatId, userId);
    return { status: "success", message: "메시지를 읽음으로 표시했습니다." };
  }

  @UseGuards(FirebaseAuthGuard)
  @SubscribeMessage("typing")
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; isTyping: boolean }
  ) {
    const userId = client.handshake.auth.userId;
    const { chatId, isTyping } = data;

    const chat = await this.chatsService.findOne(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return { status: "error", message: "권한이 없습니다." };
    }

    // 채팅방의 다른 참가자들에게 타이핑 상태 전송
    chat.participants.forEach((participantId) => {
      if (participantId.toString() !== userId) {
        const participantSocket = this.userSockets.get(
          participantId.toString()
        );
        if (participantSocket) {
          participantSocket.emit("userTyping", {
            chatId,
            userId,
            isTyping,
          });
        }
      }
    });

    return { status: "success" };
  }
}
