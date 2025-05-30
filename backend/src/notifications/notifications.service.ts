import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Notification, NotificationType } from "./schemas/notification.schema";
import { RoutinesService } from "../routines/routines.service";
import { ChallengesService } from "../challenges/challenges.service";
import { AchievementsService } from "../achievements/achievements.service";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class NotificationsService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly routinesService: RoutinesService,
    private readonly challengesService: ChallengesService,
    private readonly achievementsService: AchievementsService
  ) {}

  async createRoutineNotification(
    userId: string,
    routineId: string,
    title: string,
    content: string
  ): Promise<Notification> {
    const routine = await this.routinesService.findOne(routineId);
    if (!routine) {
      throw new NotFoundException("루틴을 찾을 수 없습니다.");
    }

    const notification = new this.notificationModel({
      userId,
      type: "ROUTINE",
      title,
      content,
      routine: routineId,
    });

    const savedNotification = await notification.save();
    this.server.to(userId).emit("notification", savedNotification);
    return savedNotification;
  }

  async createChallengeNotification(
    recipientId: string,
    title: string,
    message: string,
    challengeId?: string
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      type: "CHALLENGE",
      title,
      message,
      recipient: new Types.ObjectId(recipientId),
      challenge: challengeId ? new Types.ObjectId(challengeId) : undefined,
    });

    const savedNotification = await notification.save();
    this.server.to(recipientId).emit("notification", savedNotification);
    return savedNotification;
  }

  async createAchievementNotification(
    userId: string,
    achievementId: string,
    title: string,
    content: string
  ): Promise<Notification> {
    const achievement = await this.achievementsService.findOne(achievementId);
    if (!achievement) {
      throw new NotFoundException("업적을 찾을 수 없습니다.");
    }

    const notification = new this.notificationModel({
      userId,
      type: "ACHIEVEMENT",
      title,
      content,
      achievement: achievementId,
    });

    const savedNotification = await notification.save();
    this.server.to(userId).emit("notification", savedNotification);
    return savedNotification;
  }

  async createSocialNotification(
    recipientId: string,
    senderId: string,
    title: string,
    message: string,
    postId?: string
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      type: "SOCIAL",
      title,
      message,
      recipient: new Types.ObjectId(recipientId),
      sender: new Types.ObjectId(senderId),
      post: postId ? new Types.ObjectId(postId) : undefined,
    });

    const savedNotification = await notification.save();
    this.server.to(recipientId).emit("notification", savedNotification);
    return savedNotification;
  }

  async createSystemNotification(
    recipientId: string,
    title: string,
    message: string
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      type: "SYSTEM",
      title,
      message,
      recipient: new Types.ObjectId(recipientId),
    });

    const savedNotification = await notification.save();
    this.server.to(recipientId).emit("notification", savedNotification);
    return savedNotification;
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<{
    items: Notification[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.notificationModel
        .find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "name profileImage")
        .populate("challenge", "title")
        .populate("post", "title")
        .exec(),
      this.notificationModel.countDocuments({ recipient: userId }),
    ]);

    return { items, total };
  }

  async findUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        { _id: id, recipient: userId },
        { isRead: true },
        { new: true }
      )
      .exec();
    this.server.to(userId).emit("notification", notification);
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany({ recipient: userId, isRead: false }, { isRead: true })
      .exec();
    this.server.to(userId).emit("notifications", "all read");
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.notificationModel
      .deleteOne({ _id: id, recipient: userId })
      .exec();
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ recipient: userId }).exec();
    this.server.to(userId).emit("notifications", "all deleted");
  }
}
