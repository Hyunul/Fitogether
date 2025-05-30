import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Certification } from "../../certifications/schemas/certification.schema";

export type FeedDocument = Feed & Document;

@Schema()
export class Feed extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: "CERTIFICATION" | "CHALLENGE" | "ROUTINE";

  @Prop({ type: Types.ObjectId, ref: "Certification" })
  certification?: Certification;

  @Prop({ type: Types.ObjectId, ref: "Challenge" })
  challenge?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Routine" })
  routine?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({
    type: [
      {
        userId: String,
        content: String,
        createdAt: Date,
      },
    ],
    default: [],
  })
  comments: Array<{
    userId: string;
    content: string;
    createdAt: Date;
  }>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
