import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Routine } from "./schemas/routine.schema";
import { CreateRoutineDto } from "./dto/create-routine.dto";
import { UpdateRoutineDto } from "./dto/update-routine.dto";

@Injectable()
export class RoutinesService {
  constructor(
    @InjectModel(Routine.name) private routineModel: Model<Routine>
  ) {}

  async create(
    createRoutineDto: CreateRoutineDto,
    userId: string
  ): Promise<Routine> {
    const createdRoutine = new this.routineModel({
      ...createRoutineDto,
      creatorId: userId,
      participants: [userId],
      progress: { [userId]: 0 },
    });
    return createdRoutine.save();
  }

  async findAll(): Promise<Routine[]> {
    return this.routineModel.find().exec();
  }

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routineModel.findById(id).exec();
    if (!routine) {
      throw new NotFoundException("루틴을 찾을 수 없습니다.");
    }
    return routine;
  }

  async joinRoutine(id: string, userId: string): Promise<Routine> {
    const routine = await this.findOne(id);

    if (routine.participants.includes(userId)) {
      throw new BadRequestException("이미 참여 중인 루틴입니다.");
    }

    routine.participants.push(userId);
    routine.progress[userId] = 0;
    return routine.save();
  }

  async leaveRoutine(id: string, userId: string): Promise<Routine> {
    const routine = await this.findOne(id);

    if (!routine.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 루틴이 아닙니다.");
    }

    routine.participants = routine.participants.filter(
      (participantId) => participantId !== userId
    );
    delete routine.progress[userId];
    return routine.save();
  }

  async updateProgress(
    id: string,
    userId: string,
    progress: number
  ): Promise<Routine> {
    const routine = await this.findOne(id);

    if (!routine.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 루틴이 아닙니다.");
    }

    if (progress < 0 || progress > 100) {
      throw new BadRequestException("진행도는 0에서 100 사이여야 합니다.");
    }

    routine.progress[userId] = progress;
    return routine.save();
  }

  async addCertification(
    id: string,
    userId: string,
    imageUrl: string
  ): Promise<Routine> {
    const routine = await this.findOne(id);

    if (!routine.participants.includes(userId)) {
      throw new BadRequestException("참여 중인 루틴이 아닙니다.");
    }

    if (!routine.certifications) {
      routine.certifications = {};
    }

    if (!routine.certifications[userId]) {
      routine.certifications[userId] = [];
    }

    routine.certifications[userId].push({
      imageUrl,
      timestamp: new Date(),
    });

    return routine.save();
  }

  async getRoutineStats(id: string) {
    const routine = await this.findOne(id);
    const stats = {
      totalParticipants: routine.participants.length,
      averageProgress: 0,
      certificationCount: 0,
      participantStats: routine.participants.map((participantId) => ({
        userId: participantId,
        progress: routine.progress[participantId] || 0,
        certifications: routine.certifications?.[participantId]?.length || 0,
      })),
    };

    if (routine.participants.length > 0) {
      stats.averageProgress =
        Object.values(routine.progress).reduce((a, b) => a + b, 0) /
        routine.participants.length;
    }

    stats.certificationCount = Object.values(
      routine.certifications || {}
    ).reduce((total, certs) => total + certs.length, 0);

    return stats;
  }

  async update(
    id: string,
    updateRoutineDto: UpdateRoutineDto,
    userId: string
  ): Promise<Routine> {
    const updatedRoutine = await this.routineModel
      .findOneAndUpdate(
        { _id: id, userId },
        { $set: updateRoutineDto },
        { new: true }
      )
      .exec();

    if (!updatedRoutine) {
      throw new NotFoundException(`루틴을 찾을 수 없습니다: ${id}`);
    }

    return updatedRoutine;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.routineModel
      .deleteOne({ _id: id, userId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`루틴을 찾을 수 없습니다: ${id}`);
    }
  }

  async toggleActive(id: string): Promise<Routine> {
    const routine = await this.routineModel.findById(id).exec();
    if (!routine) {
      throw new Error("Routine not found");
    }
    routine.isActive = !routine.isActive;
    return routine.save();
  }

  async addExercise(
    id: string,
    exercise: Routine["exercises"][0]
  ): Promise<Routine> {
    return this.routineModel
      .findByIdAndUpdate(id, { $push: { exercises: exercise } }, { new: true })
      .exec();
  }

  async removeExercise(id: string, exerciseIndex: number): Promise<Routine> {
    const routine = await this.routineModel.findById(id).exec();
    if (!routine) {
      throw new Error("Routine not found");
    }
    routine.exercises.splice(exerciseIndex, 1);
    return routine.save();
  }

  async updateSchedule(
    id: string,
    schedule: Routine["schedule"]
  ): Promise<Routine> {
    return this.routineModel
      .findByIdAndUpdate(id, { $set: { schedule } }, { new: true })
      .exec();
  }
}
