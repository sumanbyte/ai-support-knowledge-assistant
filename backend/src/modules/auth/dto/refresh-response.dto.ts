import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New access token (also set as HttpOnly cookie)',
  })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
