import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema()
export class WorkoutStats {
  @Prop({ required: true })
  totalWorkouts: number;

  @Prop({ required: true })
  totalMinutes: number;

  @Prop({ required: true })
  totalCalories: number;

  @Prop({ required: true })
  averageDuration: number;

  @Prop({ required: true })
  averageCalories: number;
}

@Schema()
export class ChallengeStats {
  @Prop({ required: true })
  totalChallenges: number;

  @Prop({ required: true })
  completedChallenges: number;

  @Prop({ required: true })
  inProgressChallenges: number;

  @Prop({ required: true })
  averageProgress: number;
}

@Schema()
export class DailyStats {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  workoutCount: number;

  @Prop({ required: true })
  totalMinutes: number;

  @Prop({ required: true })
  totalCalories: number;
}

@Schema()
export class WorkoutDistribution {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  percentage: number;
}

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ required: true })
  type: "DAILY" | "WEEKLY" | "MONTHLY";

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop({ type: WorkoutStats, required: true })
  workoutStats: WorkoutStats;

  @Prop({ type: ChallengeStats, required: true })
  challengeStats: ChallengeStats;

  @Prop({ type: [DailyStats], required: true })
  dailyStats: DailyStats[];

  @Prop({ type: [WorkoutDistribution], required: true })
  workoutDistribution: WorkoutDistribution[];

  @Prop({
    type: {
      totalWorkouts: Number,
      totalDuration: Number,
      totalCalories: Number,
      mostFrequentExercise: String,
      averageHeartRate: Number,
      maxHeartRate: Number,
    },
    required: true,
  })
  summary: {
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    mostFrequentExercise: string;
    averageHeartRate: number;
    maxHeartRate: number;
  };

  @Prop({
    type: [
      {
        date: Date,
        duration: Number,
        calories: Number,
        exercises: [
          {
            name: String,
            sets: Number,
            reps: Number,
            weight: Number,
          },
        ],
      },
    ],
    default: [],
  })
  workoutDetails: Array<{
    date: Date;
    duration: number;
    calories: number;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      weight: number;
    }>;
  }>;

  @Prop({
    type: {
      progress: Number,
      achievements: [String],
      recommendations: [String],
    },
    required: true,
  })
  analysis: {
    progress: number;
    achievements: string[];
    recommendations: string[];
  };

  @Prop({ default: false })
  isShared: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
