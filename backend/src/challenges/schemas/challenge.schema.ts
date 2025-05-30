import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type ChallengeDocument = Challenge & Document;

@Schema()
export class ChallengeRule {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  targetCount: number;

  @Prop({ required: true, enum: ["COUNT", "TIME", "DISTANCE"] })
  measurementType: string;
}

@Schema()
export class ChallengeParticipant {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: [Date], default: [] })
  certificationDates: Date[];

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;
}

@Schema({ timestamps: true })
export class Challenge extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ["workout", "diet", "lifestyle"] })
  type: "workout" | "diet" | "lifestyle";

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  maxParticipants?: number;

  @Prop({ required: true, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] })
  difficulty: string;

  @Prop({ type: [ChallengeRule], required: true })
  rules: ChallengeRule[];

  @Prop()
  imageUrl?: string;

  @Prop({ type: [String], default: [] })
  hashtags: string[];

  @Prop({ type: [ChallengeParticipant], default: [] })
  participants: ChallengeParticipant[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  creatorId: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  progress: Record<string, number>;

  @Prop({ type: Object, default: {} })
  certifications: Record<string, Array<{ imageUrl: string; timestamp: Date }>>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
