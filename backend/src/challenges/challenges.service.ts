import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Challenge } from "./schemas/challenge.schema";
import { CreateChallengeDto } from "./dto/create-challenge.dto";

interface SearchParams {
  query: string;
  filters?: {
    category?: string;
    status?: string;
  };
  sort?: {
    field: string;
    order: "ASC" | "DESC";
  };
  skip?: number;
  limit?: number;
}

interface SearchResult {
  items: any[];
  total: number;
}

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name) private challengeModel: Model<Challenge>
  ) {}

  async create(
    createChallengeDto: CreateChallengeDto,
    userId: string
  ): Promise<Challenge> {
    const createdChallenge = new this.challengeModel({
      ...createChallengeDto,
      creatorId: userId,
      participants: [userId],
      progress: { [userId]: 0 },
    });
    return createdChallenge.save();
  }

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async findOne(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) {
      throw new NotFoundException("챌린지를 찾을 수 없습니다.");
    }
    return challenge;
  }

  async update(
    id: string,
    updateChallengeDto: Partial<Challenge>
  ): Promise<Challenge> {
    return this.challengeModel
      .findByIdAndUpdate(id, updateChallengeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Challenge> {
    return this.challengeModel.findByIdAndDelete(id).exec();
  }

  async joinChallenge(id: string, userId: string): Promise<Challenge> {
    const challenge = await this.findOne(id);

    if (challenge.participants.includes(userId)) {
      throw new BadRequestException("이미 참여 중인 챌린지입니다.");
    }

    if (challenge.participants.length >= challenge.maxParticipants) {
      throw new BadRequestException("참가자 수가 초과되었습니다.");
    }

    challenge.participants.push(userId);
    challenge.progress[userId] = 0;
    return challenge.save();
  }

  async leaveChallenge(id: string, userId: string): Promise<Challenge> {
    const challenge = await this.findOne(id);

    if (!challenge.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 챌린지가 아닙니다.");
    }

    challenge.participants = challenge.participants.filter(
      (participantId) => participantId !== userId
    );
    delete challenge.progress[userId];
    return challenge.save();
  }

  async updateProgress(
    id: string,
    userId: string,
    progress: number
  ): Promise<Challenge> {
    const challenge = await this.findOne(id);

    if (!challenge.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 챌린지가 아닙니다.");
    }

    if (progress < 0 || progress > 100) {
      throw new BadRequestException("진행도는 0에서 100 사이여야 합니다.");
    }

    challenge.progress[userId] = progress;
    return challenge.save();
  }

  async addCertification(
    id: string,
    userId: string,
    imageUrl: string
  ): Promise<Challenge> {
    const challenge = await this.findOne(id);

    if (!challenge.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 챌린지가 아닙니다.");
    }

    if (!challenge.certifications) {
      challenge.certifications = {};
    }

    if (!challenge.certifications[userId]) {
      challenge.certifications[userId] = [];
    }

    challenge.certifications[userId].push({
      imageUrl,
      timestamp: new Date(),
    });

    return challenge.save();
  }

  async getLeaderboard(id: string) {
    const challenge = await this.findOne(id);
    const leaderboard = challenge.participants.map((participantId) => ({
      userId: participantId,
      progress: challenge.progress[participantId] || 0,
      certifications: challenge.certifications?.[participantId]?.length || 0,
    }));

    return leaderboard.sort((a, b) => b.progress - a.progress);
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const { query, filters, sort, skip = 0, limit = 10 } = params;

    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };

    if (filters?.category) {
      searchQuery.category = filters.category;
    }

    if (filters?.status) {
      searchQuery.status = filters.status;
    }

    const sortQuery: any = {};
    if (sort) {
      sortQuery[sort.field] = sort.order === "ASC" ? 1 : -1;
    } else {
      sortQuery.createdAt = -1;
    }

    const [items, total] = await Promise.all([
      this.challengeModel
        .find(searchQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("creator", "name profileImage")
        .populate("participants", "name profileImage")
        .exec(),
      this.challengeModel.countDocuments(searchQuery),
    ]);

    return { items, total };
  }
}
