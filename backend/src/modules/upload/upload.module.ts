import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ChunkingService } from '../chunking/chunking.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DocumentsService } from '../documents/documents.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaService } from '../auth/prisma/prisma.service';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (_req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
          return callback(new Error('Only image and PDF files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB (Cloudinary free tier allows up to 10MB per file)
      },
    }),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    DocumentsService,
    ChunkingService,
    EmbeddingsService,
    VectorService,
    PrismaService,
  ],
})
export class UploadModule { }
