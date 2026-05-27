import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "fallback",
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "3600") }
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
})
export class AuthModule { }
