import type { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

/** Reads access JWT from HttpOnly cookie, then Authorization: Bearer header. */
export const accessTokenFromRequest = ExtractJwt.fromExtractors([
  (req: Request) => req?.cookies?.access_token ?? null,
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);
