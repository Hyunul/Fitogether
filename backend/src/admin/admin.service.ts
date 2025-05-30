import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Admin, AdminRole } from "./schemas/admin.schema";
import { UsersService } from "../users/users.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    private readonly usersService: UsersService
  ) {}

  async createAdmin(data: {
    user: Types.ObjectId;
    role: AdminRole;
    permissions?: string[];
  }) {
    const admin = await this.adminModel.create(data);
    return admin;
  }

  async findAll() {
    return this.adminModel
      .find()
      .populate("user", "email displayName profileImage")
      .exec();
  }

  async findOne(id: string) {
    const admin = await this.adminModel
      .findById(id)
      .populate("user", "email displayName profileImage")
      .exec();

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return admin;
  }

  async findByUserId(userId: string) {
    const admin = await this.adminModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate("user", "email displayName profileImage")
      .exec();

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return admin;
  }

  async update(id: string, data: Partial<Admin>) {
    const admin = await this.adminModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate("user", "email displayName profileImage")
      .exec();

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return admin;
  }

  async remove(id: string) {
    const admin = await this.adminModel.findByIdAndDelete(id).exec();

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return admin;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const admin = await this.adminModel
      .findOne({ user: new Types.ObjectId(userId) })
      .exec();
    return !!admin;
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const admin = await this.adminModel
      .findOne({ user: new Types.ObjectId(userId) })
      .exec();

    if (!admin) return false;

    if (admin.role === AdminRole.SUPER_ADMIN) return true;

    return admin.permissions?.includes(permission) || false;
  }
}
