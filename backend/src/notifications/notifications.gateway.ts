import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { UseGuards } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger("NotificationsGateway");
  private userSockets = new Map<string, Socket>();

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      // Firebase 토큰 검증
      const decodedToken = await this.validateToken(token);
      const userId = decodedToken.uid;

      // 사용자 소켓 매핑
      this.userSockets.set(userId, client);
      this.logger.log(`Client connected: ${userId}`);
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // 사용자 소켓 매핑 제거
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket === client) {
        this.userSockets.delete(userId);
        this.logger.log(`Client disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage("join")
  handleJoin(client: Socket, userId: string) {
    client.join(userId);
    this.logger.log(`Client joined room: ${userId}`);
  }

  @SubscribeMessage("leave")
  handleLeave(client: Socket, userId: string) {
    client.leave(userId);
    this.logger.log(`Client left room: ${userId}`);
  }

  // 특정 사용자에게 알림 전송
  async sendNotification(userId: string, notification: any) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit("notification", notification);
    }
  }

  // 여러 사용자에게 알림 전송
  async broadcastNotification(userIds: string[], notification: any) {
    userIds.forEach((userId) => {
      this.sendNotification(userId, notification);
    });
  }

  private async validateToken(token: string) {
    // Firebase 토큰 검증 로직
    // 실제 구현에서는 Firebase Admin SDK를 사용하여 토큰 검증
    return { uid: "user-id" }; // 임시 구현
  }
}
