import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../config/app.config';
import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig
  ) { }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async register(signupDto: SignupDto) {
    const { email, name, password } = signupDto;

    const existing = await this.userService.findByEmail(email);

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await this.userService.create({
      email,
      name,
      password: hashedPassword,
    });

    return {
      id: created.id,
      email: created.email,
      name: created.name,
    };
  }

  // 2. Validate Local User for Sign In
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password || '');

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }

    }

    return null;
  }

  // 3. Handle or Registe Google User on callback
  async validateGoogleUser(googleUser: any) {
    let user = await this.userService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.create({
        email: googleUser.email,
        name: `${googleUser.firstName} ${googleUser.lastName}`,

        googleId: googleUser.id
      })
    } else if (!user.googleId) {
      user = await this.userService.updateGoogleId(user.id, googleUser.googleId);
    }

    return this.generateToken(user)
  }


  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: this.appConfig.jwtExpiresIn },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: this.appConfig.jwtRefreshExpiresIn },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: { email: string; sub: string; type?: string };
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const { accessToken, refreshToken: newRefreshToken, user: safeUser } =
      await this.generateToken(user);

    res.cookie(
      'refresh_token',
      newRefreshToken,
      this.appConfig.getCookieOptions('refresh'),
    );
    res.cookie(
      'access_token',
      accessToken,
      this.appConfig.getCookieOptions('access'),
    );

    return { accessToken, user: safeUser };
  }

  async login(
    user: { id: string; email: string; name: string },
    res: Response,
  ) {
    const { accessToken, refreshToken, user: safeUser } =
      await this.generateToken(user);

    res.cookie(
      'refresh_token',
      refreshToken,
      this.appConfig.getCookieOptions('refresh'),
    );
    res.cookie(
      'access_token',
      accessToken,
      this.appConfig.getCookieOptions('access'),
    );

    return { user: safeUser };
  }

  logout(res: Response) {
    const accessOpts = this.appConfig.getCookieOptions('access');
    const refreshOpts = this.appConfig.getCookieOptions('refresh');
    res.clearCookie('access_token', accessOpts);
    res.clearCookie('refresh_token', refreshOpts);
    return { ok: true };
  }

}
