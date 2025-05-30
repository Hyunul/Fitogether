import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum NotificationType {
  CHALLENGE_INVITE = "CHALLENGE_INVITE",
  CHALLENGE_COMPLETE = "CHALLENGE_COMPLETE",
  FOLLOW = "FOLLOW",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  SYSTEM = "SYSTEM",
}

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  sender: Types.ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, refPath: "referenceModel" })
  reference: Types.ObjectId;

  @Prop({ enum: ["Challenge", "Post", "User"] })
  referenceModel: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
