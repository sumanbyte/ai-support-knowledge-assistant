import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { GetUser } from './decorators/current-user.decorator';
import type { Request, Response } from 'express';
import { AppConfig } from '@/src/config/app.config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig: AppConfig
  ) { }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User created', type: AuthUserDto })
  @ApiConflictResponse({ description: 'Email already exists' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.register(signupDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Sets access_token and refresh_token cookies',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(
    @GetUser() user: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start Google OAuth' })
  googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Failed to login with Google`);
    }

    try {
      const { accessToken, refreshToken } =
        await this.authService.validateGoogleUser(user);
      res.cookie('refresh_token', refreshToken, this.appConfig.getCookieOptions('refresh'));
      res.cookie('access_token', accessToken, this.appConfig.getCookieOptions('access'));
      return res.redirect(`${this.appConfig.getEnvConfig().FRONTEND_URL}/dashboard`);
    } catch {
      return res.redirect(
        `${this.appConfig.getEnvConfig().FRONTEND_URL}/login?error=google_failed`,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user from access token' })
  @ApiOkResponse({ type: AuthUserDto })
  @ApiUnauthorizedResponse()
  getMe(@GetUser() user: AuthUserDto) {
    return user;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh_token cookie' })
  @ApiOkResponse({
    description: 'Issues new tokens (also set as HttpOnly cookies)',
    type: RefreshResponseDto,
  })
  @ApiUnauthorizedResponse()
  refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear auth cookies and sign out' })
  @ApiOkResponse({ description: 'Logged out' })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
