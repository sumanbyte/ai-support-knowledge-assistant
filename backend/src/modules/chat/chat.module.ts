import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { AppConfig } from 'src/config/app.config';
import { RagService } from '../rag/rag.service';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, EmbeddingsService, VectorService, AppConfig, RagService, GeminiService],
})
export class ChatModule { }
