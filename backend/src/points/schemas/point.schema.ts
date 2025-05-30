import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum PointType {
  CHALLENGE_COMPLETE = "CHALLENGE_COMPLETE",
  DAILY_CHECKIN = "DAILY_CHECKIN",
  POST_CREATE = "POST_CREATE",
  COMMENT_CREATE = "COMMENT_CREATE",
  LIKE_RECEIVE = "LIKE_RECEIVE",
  FOLLOW_RECEIVE = "FOLLOW_RECEIVE",
}

@Schema({ timestamps: true })
export class Point extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ required: true, enum: PointType })
  type: PointType;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, refPath: "referenceModel" })
  reference: Types.ObjectId;

  @Prop({ enum: ["Challenge", "Post", "User"] })
  referenceModel: string;

  @Prop()
  description: string;
}

export const PointSchema = SchemaFactory.createForClass(Point);
