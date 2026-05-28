import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'user@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123', minLength: 8, maxLength: 16 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
