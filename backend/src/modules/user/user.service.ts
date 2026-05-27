import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/generated/prisma/client';
import { PrismaService } from '../auth/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
        googleId: createUserDto.googleId,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async updateGoogleId(id: string, googleId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { googleId }
    })
  }
}
