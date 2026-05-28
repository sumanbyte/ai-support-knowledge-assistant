import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Passport JWT defaults to Authorization header; promote cookie token when present.
    const accessToken = request.cookies?.access_token;
    if (accessToken && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${accessToken}`;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: unknown, user: TUser, info: unknown): TUser {
    if (err || !user) {
      const message =
        info instanceof Error
          ? info.message
          : typeof info === 'string'
            ? info
            : 'Invalid or missing access token';
      throw err ?? new UnauthorizedException(message);
    }
    return user;
  }
}
