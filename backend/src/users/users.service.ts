import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

interface SearchParams {
  query: string;
  filters?: {
    category?: string;
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
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User> {
    const user = await this.userModel.findOne({ firebaseUid }).exec();
    if (!user) {
      throw new NotFoundException(
        `User with Firebase UID ${firebaseUid} not found`
      );
    }
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async addFriend(userId: string, friendId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      )
      .exec();
  }

  async removeFriend(userId: string, friendId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      )
      .exec();
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const { query, filters, sort, skip = 0, limit = 10 } = params;

    const searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ],
    };

    if (filters?.category) {
      searchQuery.categories = filters.category;
    }

    const sortQuery: any = {};
    if (sort) {
      sortQuery[sort.field] = sort.order === "ASC" ? 1 : -1;
    } else {
      sortQuery.createdAt = -1;
    }

    const [items, total] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select("-password")
        .exec(),
      this.userModel.countDocuments(searchQuery),
    ]);

    return { items, total };
  }

  async follow(followerId: string, followingId: string): Promise<User> {
    const [follower, following] = await Promise.all([
      this.findOne(followerId),
      this.findOne(followingId),
    ]);

    if (!follower.following.includes(followingId)) {
      follower.following.push(followingId);
      await follower.save();
    }

    if (!following.followers.includes(followerId)) {
      following.followers.push(followerId);
      await following.save();
    }

    return follower;
  }

  async unfollow(followerId: string, followingId: string): Promise<User> {
    const [follower, following] = await Promise.all([
      this.findOne(followerId),
      this.findOne(followingId),
    ]);

    follower.following = follower.following.filter((id) => id !== followingId);
    following.followers = following.followers.filter((id) => id !== followerId);

    await Promise.all([follower.save(), following.save()]);

    return follower;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.findOne(userId);
    return this.userModel.find({ _id: { $in: user.followers } }).exec();
  }

  async getFollowing(userId: string): Promise<User[]> {
    const user = await this.findOne(userId);
    return this.userModel.find({ _id: { $in: user.following } }).exec();
  }
}
