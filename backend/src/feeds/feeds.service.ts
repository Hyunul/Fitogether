import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Feed } from "./schemas/feed.schema";
import { CertificationsService } from "../certifications/certifications.service";
import { ChallengesService } from "../challenges/challenges.service";
import { RoutinesService } from "../routines/routines.service";

@Injectable()
export class FeedsService {
  constructor(
    @InjectModel(Feed.name)
    private feedModel: Model<Feed>,
    private readonly certificationsService: CertificationsService,
    private readonly challengesService: ChallengesService,
    private readonly routinesService: RoutinesService
  ) {}

  async createFromCertification(
    certificationId: string,
    userId: string
  ): Promise<Feed> {
    const certification = await this.certificationsService.findOne(
      certificationId
    );
    if (!certification) {
      throw new NotFoundException("인증을 찾을 수 없습니다.");
    }

    const feed = new this.feedModel({
      userId,
      type: "CERTIFICATION",
      certification: certification._id,
    });

    return feed.save();
  }

  async createFromChallenge(
    challengeId: string,
    userId: string
  ): Promise<Feed> {
    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw new NotFoundException("챌린지를 찾을 수 없습니다.");
    }

    const feed = new this.feedModel({
      userId,
      type: "CHALLENGE",
      challenge: challenge._id,
    });

    return feed.save();
  }

  async createFromRoutine(routineId: string, userId: string): Promise<Feed> {
    const routine = await this.routinesService.findOne(routineId);
    if (!routine) {
      throw new NotFoundException("루틴을 찾을 수 없습니다.");
    }

    const feed = new this.feedModel({
      userId,
      type: "ROUTINE",
      routine: routine._id,
    });

    return feed.save();
  }

  async findAll(page = 1, limit = 10): Promise<Feed[]> {
    const skip = (page - 1) * limit;
    return this.feedModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("certification")
      .populate("challenge")
      .populate("routine")
      .exec();
  }

  async findOne(id: string): Promise<Feed> {
    const feed = await this.feedModel
      .findById(id)
      .populate("certification")
      .populate("challenge")
      .populate("routine")
      .exec();

    if (!feed) {
      throw new NotFoundException("피드를 찾을 수 없습니다.");
    }

    return feed;
  }

  async toggleLike(id: string, userId: string): Promise<Feed> {
    const feed = await this.findOne(id);
    const likeIndex = feed.likes.indexOf(userId);

    if (likeIndex === -1) {
      feed.likes.push(userId);
    } else {
      feed.likes.splice(likeIndex, 1);
    }

    return feed.save();
  }

  async addComment(id: string, userId: string, content: string): Promise<Feed> {
    const feed = await this.findOne(id);
    feed.comments.push({
      userId,
      content,
      createdAt: new Date(),
    });

    return feed.save();
  }

  async removeComment(
    id: string,
    commentIndex: number,
    userId: string
  ): Promise<Feed> {
    const feed = await this.findOne(id);
    const comment = feed.comments[commentIndex];

    if (!comment) {
      throw new NotFoundException("댓글을 찾을 수 없습니다.");
    }

    if (comment.userId !== userId) {
      throw new BadRequestException("자신의 댓글만 삭제할 수 있습니다.");
    }

    feed.comments.splice(commentIndex, 1);
    return feed.save();
  }

  async getUserFeeds(userId: string, page = 1, limit = 10): Promise<Feed[]> {
    const skip = (page - 1) * limit;
    return this.feedModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("certification")
      .populate("challenge")
      .populate("routine")
      .exec();
  }
}
