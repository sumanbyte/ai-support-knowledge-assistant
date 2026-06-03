import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiPropertyOptional({
    description:
      'Refresh JWT when HttpOnly cookie is unavailable (e.g. cross-site browsers)',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
