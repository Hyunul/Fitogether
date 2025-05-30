import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class ExerciseDto {
  @ApiProperty({ example: "스쿼트", description: "운동 이름", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 3, description: "세트 수", required: false })
  @IsOptional()
  @IsNumber()
  sets?: number;

  @ApiProperty({ example: 12, description: "반복 횟수", required: false })
  @IsOptional()
  @IsNumber()
  reps?: number;

  @ApiProperty({ example: 60, description: "무게(kg)", required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ example: 60, description: "휴식 시간(초)", required: false })
  @IsOptional()
  @IsNumber()
  restTime?: number;

  @ApiProperty({
    example: "가슴을 펴고 시선은 앞으로",
    description: "운동 노트",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

class ScheduleDto {
  @ApiProperty({
    example: ["MON", "WED", "FRI"],
    description: "운동 요일",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  days?: string[];

  @ApiProperty({ example: "09:00", description: "운동 시간", required: false })
  @IsOptional()
  @IsString()
  time?: string;
}

export class UpdateRoutineDto {
  @ApiProperty({
    example: "가슴 운동",
    description: "루틴 이름",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: "가슴 근육 발달을 위한 루틴",
    description: "루틴 설명",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: [ExerciseDto],
    description: "운동 목록",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises?: ExerciseDto[];

  @ApiProperty({ type: ScheduleDto, description: "운동 일정", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto;

  @ApiProperty({ example: true, description: "활성화 여부", required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
