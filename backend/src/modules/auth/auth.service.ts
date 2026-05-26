import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }
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

  async register(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userService.create({
      email,
      name,
      password: hashedPassword
    })

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

    return this.login(user)
  }


  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }
  }

}
