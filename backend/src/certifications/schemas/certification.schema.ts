import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CertificationDocument = Certification & Document;

@Schema()
export class Certification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  routineId: string;

  @Prop({ required: true })
  type: "TIMER" | "CAMERA" | "MEMO";

  @Prop()
  imageUrl?: string;

  @Prop()
  memo?: string;

  @Prop()
  duration?: number; // 초 단위

  @Prop({ required: true })
  completedAt: Date;

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

export const CertificationSchema = SchemaFactory.createForClass(Certification);
