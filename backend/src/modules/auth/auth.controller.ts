import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  //Local Sign In
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: any) {
    return this.authService.login(req.user as User);
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
