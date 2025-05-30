import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AchievementDocument = Achievement & Document;

@Schema({ timestamps: true })
export class Achievement {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  requirement: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: false })
  isSecret: boolean;

  @Prop({ type: [String], default: [] })
  unlockedBy: string[];
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
