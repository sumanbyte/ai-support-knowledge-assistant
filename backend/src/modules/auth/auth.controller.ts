import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { GetUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.register(signupDto);
  }

  //Local Sign In
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Initiates google oauth redirection 
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {

  }

  //Google OAuth Callback endpoint
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.validateGoogleUser(req.user);
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@GetUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh")
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req);
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
