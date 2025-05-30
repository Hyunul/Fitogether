import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Chat } from "./schemas/chat.schema";
import { ChallengesService } from "../challenges/challenges.service";

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
    private readonly challengesService: ChallengesService
  ) {}

  async createDirectChat(userId1: string, userId2: string): Promise<Chat> {
    // 이미 존재하는 1:1 채팅방이 있는지 확인
    const existingChat = await this.chatModel.findOne({
      type: "DIRECT",
      participants: { $all: [userId1, userId2] },
    });

    if (existingChat) {
      return existingChat;
    }

    const chat = new this.chatModel({
      type: "DIRECT",
      name: "1:1 채팅",
      participants: [userId1, userId2],
    });

    return chat.save();
  }

  async createGroupChat(name: string, participants: string[]): Promise<Chat> {
    if (participants.length < 2) {
      throw new BadRequestException(
        "그룹 채팅은 최소 2명 이상의 참가자가 필요합니다."
      );
    }

    const chat = new this.chatModel({
      type: "GROUP",
      name,
      participants,
    });

    return chat.save();
  }

  async createChallengeChat(
    challengeId: string,
    participants: string[]
  ): Promise<Chat> {
    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw new NotFoundException("챌린지를 찾을 수 없습니다.");
    }

    const chat = new this.chatModel({
      type: "CHALLENGE",
      name: `${challenge.title} 채팅`,
      participants,
      challenge: challengeId,
    });

    return chat.save();
  }

  async findAll(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate("participants", "name profileImage")
      .populate("challenge")
      .exec();
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatModel
      .findById(id)
      .populate("participants", "name profileImage")
      .populate("challenge")
      .exec();

    if (!chat) {
      throw new NotFoundException("채팅방을 찾을 수 없습니다.");
    }

    return chat;
  }

  async addMessage(
    chatId: string,
    userId: string,
    content: string,
    type: "TEXT" | "IMAGE" | "FILE" = "TEXT",
    fileUrl?: string
  ): Promise<Chat> {
    const chat = await this.findOne(chatId);
    if (!chat.participants.includes(userId)) {
      throw new BadRequestException("채팅방에 참여하고 있지 않습니다.");
    }

    const message = {
      userId: new Types.ObjectId(userId),
      content,
      type,
      fileUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chat.messages.push(message);
    chat.updatedAt = new Date();

    return chat.save();
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    const chat = await this.findOne(chatId);
    if (!chat.participants.includes(userId)) {
      throw new BadRequestException("채팅방에 참여하고 있지 않습니다.");
    }

    chat.lastRead.set(userId.toString(), new Date());
    await chat.save();
  }

  async addParticipant(chatId: string, userId: string): Promise<Chat> {
    const chat = await this.findOne(chatId);
    if (chat.type === "DIRECT") {
      throw new BadRequestException(
        "1:1 채팅방에는 참가자를 추가할 수 없습니다."
      );
    }

    if (chat.participants.includes(userId)) {
      throw new BadRequestException("이미 참가 중인 사용자입니다.");
    }

    chat.participants.push(userId);
    return chat.save();
  }

  async removeParticipant(chatId: string, userId: string): Promise<Chat> {
    const chat = await this.findOne(chatId);
    if (chat.type === "DIRECT") {
      throw new BadRequestException(
        "1:1 채팅방에서는 참가자를 제거할 수 없습니다."
      );
    }

    const index = chat.participants.indexOf(userId);
    if (index === -1) {
      throw new BadRequestException("참가 중이 아닌 사용자입니다.");
    }

    chat.participants.splice(index, 1);
    return chat.save();
  }

  async delete(chatId: string, userId: string): Promise<void> {
    const chat = await this.findOne(chatId);
    if (!chat.participants.includes(userId)) {
      throw new BadRequestException("채팅방을 삭제할 권한이 없습니다.");
    }

    await this.chatModel.deleteOne({ _id: chatId }).exec();
  }
}
