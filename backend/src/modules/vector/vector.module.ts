import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { VectorController } from './vector.controller';
import { PrismaService } from '../auth/prisma/prisma.service';
import { AppConfig } from 'src/config/app.config';

@Module({
  controllers: [VectorController],
  providers: [VectorService, PrismaService, AppConfig],
  exports: [VectorService],
})
export class VectorModule { }
