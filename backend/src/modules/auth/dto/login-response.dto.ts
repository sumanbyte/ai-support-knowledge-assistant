import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access JWT (also set as HttpOnly cookie when cookies work)',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh JWT (also set as HttpOnly cookie when cookies work)',
  })
  refreshToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
