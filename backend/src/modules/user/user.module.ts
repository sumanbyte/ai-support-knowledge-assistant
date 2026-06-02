import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../auth/prisma/prisma.service';
import { VectorModule } from '../vector/vector.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [VectorModule, CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule { }
