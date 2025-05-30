import { IsString, IsEnum, IsOptional, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCertificationDto {
  @ApiProperty({ description: "인증 유형", enum: ["TIMER", "CAMERA", "MEMO"] })
  @IsEnum(["TIMER", "CAMERA", "MEMO"])
  type: "TIMER" | "CAMERA" | "MEMO";

  @ApiProperty({ description: "인증 이미지 URL", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: "메모", required: false })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiProperty({ description: "운동 시간 (초)", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({ description: "완료 시간" })
  @IsString()
  completedAt: string;
}
