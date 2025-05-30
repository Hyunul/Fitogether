import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ required: true, enum: AdminRole })
  role: AdminRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  permissions: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
