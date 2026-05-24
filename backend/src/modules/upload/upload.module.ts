import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import { extname } from 'path';
import { DocumentsService } from '../documents/documents.service';
import { ChunkingService } from '../chunking/chunking.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { AppConfig } from 'src/config/app.config';


@Module({
  controllers: [UploadController],
  providers: [UploadService, DocumentsService, ChunkingService, EmbeddingsService, AppConfig],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads", //Where to save files
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.originalname}-${uniqueSuffix}${ext}`)
        },


      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
          return callback(new Error('Only image and PDF files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit

      }
    }),
  ],

})
export class UploadModule { }
