import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New access token (also set as HttpOnly cookie)',
  })
  accessToken: string;

  @ApiProperty({
    description: 'New refresh token (also set as HttpOnly cookie)',
  })
  refreshToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
