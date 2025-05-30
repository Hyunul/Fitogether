import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com", description: "사용자 이메일" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "홍길동", description: "사용자 이름" })
  @IsString()
  name: string;

  @ApiProperty({
    example: "https://example.com/profile.jpg",
    description: "프로필 이미지 URL",
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ example: true, description: "알림 설정", required: false })
  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @ApiProperty({ example: "ko", description: "언어 설정", required: false })
  @IsOptional()
  @IsEnum(["ko", "en"])
  language?: string;
}
