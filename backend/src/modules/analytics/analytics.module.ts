import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PrismaService } from '../auth/prisma/prisma.service';
import { VectorService } from '../vector/vector.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService, VectorService],
})
export class AnalyticsModule { }
