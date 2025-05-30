import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Certification } from "./schemas/certification.schema";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { RoutinesService } from "../routines/routines.service";

@Injectable()
export class CertificationsService {
  constructor(
    @InjectModel(Certification.name)
    private certificationModel: Model<Certification>,
    private readonly routinesService: RoutinesService
  ) {}

  async create(
    routineId: string,
    userId: string,
    createCertificationDto: CreateCertificationDto
  ): Promise<Certification> {
    // 루틴 존재 여부 확인
    const routine = await this.routinesService.findOne(routineId);
    if (!routine.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 루틴이 아닙니다.");
    }

    // 인증 유형에 따른 유효성 검사
    if (
      createCertificationDto.type === "CAMERA" &&
      !createCertificationDto.imageUrl
    ) {
      throw new BadRequestException("카메라 인증에는 이미지가 필요합니다.");
    }

    if (
      createCertificationDto.type === "TIMER" &&
      !createCertificationDto.duration
    ) {
      throw new BadRequestException("타이머 인증에는 운동 시간이 필요합니다.");
    }

    const certification = new this.certificationModel({
      ...createCertificationDto,
      userId,
      routineId,
      completedAt: new Date(createCertificationDto.completedAt),
    });

    // 루틴의 진행도 업데이트
    const progress = Math.min(
      ((routine.certifications?.[userId]?.length || 0) + 1) * 20,
      100
    );
    await this.routinesService.updateProgress(routineId, userId, progress);

    return certification.save();
  }

  async findAll(routineId: string): Promise<Certification[]> {
    return this.certificationModel
      .find({ routineId })
      .sort({ completedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Certification> {
    const certification = await this.certificationModel.findById(id).exec();
    if (!certification) {
      throw new NotFoundException("인증을 찾을 수 없습니다.");
    }
    return certification;
  }

  async toggleLike(id: string, userId: string): Promise<Certification> {
    const certification = await this.findOne(id);
    const likeIndex = certification.likes.indexOf(userId);

    if (likeIndex === -1) {
      certification.likes.push(userId);
    } else {
      certification.likes.splice(likeIndex, 1);
    }

    return certification.save();
  }

  async addComment(
    id: string,
    userId: string,
    content: string
  ): Promise<Certification> {
    const certification = await this.findOne(id);
    certification.comments.push({
      userId,
      content,
      createdAt: new Date(),
    });

    return certification.save();
  }

  async removeComment(
    id: string,
    commentIndex: number,
    userId: string
  ): Promise<Certification> {
    const certification = await this.findOne(id);
    const comment = certification.comments[commentIndex];

    if (!comment) {
      throw new NotFoundException("댓글을 찾을 수 없습니다.");
    }

    if (comment.userId !== userId) {
      throw new BadRequestException("자신의 댓글만 삭제할 수 있습니다.");
    }

    certification.comments.splice(commentIndex, 1);
    return certification.save();
  }

  async getUserCertifications(
    userId: string,
    routineId: string
  ): Promise<Certification[]> {
    return this.certificationModel
      .find({ userId, routineId })
      .sort({ completedAt: -1 })
      .exec();
  }
}
