import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RoutineDocument = Routine & Document;

@Schema()
export class WorkoutSet {
  @Prop({ required: true })
  exercise: string;

  @Prop({ required: true })
  sets: number;

  @Prop({ required: true })
  reps: number;

  @Prop()
  weight?: number;

  @Prop()
  duration?: number; // 초 단위

  @Prop()
  restTime?: number; // 초 단위
}

@Schema()
export class Routine extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  daysOfWeek: string[]; // ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

  @Prop({ required: true })
  startTime: string; // HH:mm 형식

  @Prop({ required: true })
  endTime: string; // HH:mm 형식

  @Prop({ type: [WorkoutSet], required: true })
  workoutSets: WorkoutSet[];

  @Prop({ required: true })
  creatorId: string;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ type: Object, default: {} })
  progress: Record<string, number>; // userId: progress

  @Prop({ type: Object, default: {} })
  certifications: Record<string, Array<{ imageUrl: string; timestamp: Date }>>;

  @Prop({ required: true, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] })
  difficulty: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);
