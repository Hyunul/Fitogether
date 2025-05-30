import { IsString, IsEnum, IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReportDto {
  @ApiProperty({
    example: "WEEKLY",
    description: "리포트 타입",
    enum: ["WEEKLY", "MONTHLY"],
  })
  @IsEnum(["WEEKLY", "MONTHLY"])
  type: string;

  @ApiProperty({ example: "2024-03-01", description: "시작일" })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: "2024-03-07", description: "종료일" })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    example: "이번 주 운동 리포트",
    description: "리포트 제목",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: "이번 주 운동 기록과 성과를 정리했습니다.",
    description: "리포트 설명",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
