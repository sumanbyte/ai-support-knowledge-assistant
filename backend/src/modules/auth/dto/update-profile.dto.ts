import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Display / workspace name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  name: string;
}
