import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Point, PointType } from "./schemas/point.schema";

@Injectable()
export class PointsService {
  constructor(
    @InjectModel(Point.name)
    private pointModel: Model<Point>
  ) {}

  async addPoints(data: {
    user: Types.ObjectId;
    type: PointType;
    amount: number;
    reference?: Types.ObjectId;
    referenceModel?: string;
    description?: string;
  }) {
    const point = await this.pointModel.create(data);
    return point;
  }

  async getUserPoints(userId: string) {
    const points = await this.pointModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    const totalPoints = points.reduce((sum, point) => sum + point.amount, 0);

    return {
      points,
      totalPoints,
    };
  }

  async getPointHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [points, total] = await Promise.all([
      this.pointModel
        .find({ user: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.pointModel.countDocuments({ user: new Types.ObjectId(userId) }),
    ]);

    return {
      points,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPointsByType(userId: string, type: PointType) {
    return this.pointModel
      .find({
        user: new Types.ObjectId(userId),
        type,
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
