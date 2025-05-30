import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class ChallengeRuleDto {
  @ApiProperty({ example: "스쿼트 100회", description: "챌린지 규칙" })
  @IsString()
  description: string;

  @ApiProperty({ example: 100, description: "목표 횟수" })
  @IsNumber()
  targetCount: number;

  @ApiProperty({
    example: "COUNT",
    description: "측정 방식",
    enum: ["COUNT", "TIME", "DISTANCE"],
  })
  @IsEnum(["COUNT", "TIME", "DISTANCE"])
  measurementType: string;
}

export class CreateChallengeDto {
  @ApiProperty({ example: "30일 스쿼트 챌린지", description: "챌린지 제목" })
  @IsString()
  title: string;

  @ApiProperty({
    example: "30일 동안 매일 스쿼트 100회 하기",
    description: "챌린지 설명",
  })
  @IsString()
  description: string;

  @ApiProperty({ example: "2024-03-01", description: "시작일" })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: "2024-03-30", description: "종료일" })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: 30, description: "참가자 수 제한", required: false })
  @IsOptional()
  @IsNumber()
  maxParticipants?: number;

  @ApiProperty({
    example: "BEGINNER",
    description: "난이도",
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  })
  @IsEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
  difficulty: string;

  @ApiProperty({ type: [ChallengeRuleDto], description: "챌린지 규칙" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChallengeRuleDto)
  rules: ChallengeRuleDto[];

  @ApiProperty({
    example: "https://example.com/challenge-image.jpg",
    description: "챌린지 이미지 URL",
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: ["#스쿼트", "#30일챌린지"],
    description: "해시태그",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
}
