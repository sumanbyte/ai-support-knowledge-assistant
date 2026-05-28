import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AppConfig } from '../../../config/app.config';
import { accessTokenFromRequest } from '../utils/jwt-extractors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UserService,
    appConfig: AppConfig,
  ) {
    super({
      jwtFromRequest: accessTokenFromRequest,
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string; type?: string }) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
