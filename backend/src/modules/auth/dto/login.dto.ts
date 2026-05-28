import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8, maxLength: 16 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
