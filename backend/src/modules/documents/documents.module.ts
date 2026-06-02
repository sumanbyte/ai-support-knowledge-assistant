import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ChunkingService } from '../chunking/chunking.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { PrismaService } from '../auth/prisma/prisma.service';
import { LoggerGateway } from '../logger/logger.gateway';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, ChunkingService, EmbeddingsService, VectorService, PrismaService, LoggerGateway],
})
export class DocumentsModule { }
