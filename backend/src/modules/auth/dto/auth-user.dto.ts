import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: '4dce2c35-c0e7-4f6a-8c4d-bd8108d2ed9c' })
  id: string;

  @ApiProperty({ example: 'user@company.com' })
  email: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;
}
