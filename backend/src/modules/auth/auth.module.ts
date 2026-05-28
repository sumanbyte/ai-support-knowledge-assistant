import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from '../user/user.module';
import { AppConfig } from '../../config/app.config';
import { AppConfigModule } from '../../config/app-config.module';

@Module({
  imports: [
    UserModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfig],
      useFactory: (appConfig: AppConfig) => ({
        secret: appConfig.jwtSecret,
        signOptions: { expiresIn: appConfig.jwtExpiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
