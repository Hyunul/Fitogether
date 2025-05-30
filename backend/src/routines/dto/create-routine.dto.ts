import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsEnum,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class WorkoutSetDto {
  @ApiProperty({ description: "운동 이름" })
  @IsString()
  exercise: string;

  @ApiProperty({ description: "세트 수" })
  @IsNumber()
  @Min(1)
  sets: number;

  @ApiProperty({ description: "반복 횟수" })
  @IsNumber()
  @Min(1)
  reps: number;

  @ApiProperty({ description: "무게 (kg)", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({ description: "운동 시간 (초)", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({ description: "휴식 시간 (초)", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  restTime?: number;
}

export class CreateRoutineDto {
  @ApiProperty({ description: "루틴 제목" })
  @IsString()
  title: string;

  @ApiProperty({ description: "루틴 설명" })
  @IsString()
  description: string;

  @ApiProperty({ description: "운동 요일", example: ["MON", "WED", "FRI"] })
  @IsArray()
  @IsString({ each: true })
  daysOfWeek: string[];

  @ApiProperty({ description: "시작 시간 (HH:mm)", example: "09:00" })
  @IsString()
  startTime: string;

  @ApiProperty({ description: "종료 시간 (HH:mm)", example: "10:00" })
  @IsString()
  endTime: string;

  @ApiProperty({ description: "운동 세트 목록", type: [WorkoutSetDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutSetDto)
  workoutSets: WorkoutSetDto[];

  @ApiProperty({
    description: "난이도",
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  })
  @IsEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
  difficulty: string;

  @ApiProperty({ description: "태그 목록", required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
