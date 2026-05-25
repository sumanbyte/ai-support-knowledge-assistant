import { Injectable } from '@nestjs/common';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';
import { UpdateEmbeddingDto } from './dto/update-embedding.dto';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';
import { Index } from '@upstash/vector';

@Injectable()
export class EmbeddingsService {
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel

  constructor(
    private readonly appConfig: AppConfig
  ) {
    this.genAI = new GoogleGenerativeAI(appConfig.getEnvConfig().GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-embedding-001", });

  }

  create(createEmbeddingDto: CreateEmbeddingDto) {
    return 'This action adds a new embedding';
  }

  findAll() {
    return `This action returns all embeddings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} embedding`;
  }

  update(id: number, updateEmbeddingDto: UpdateEmbeddingDto) {
    return `This action updates a #${id} embedding`;
  }

  remove(id: number) {
    return `This action removes a #${id} embedding`;
  }

  async generateEmbeddings(chunks: string[]): Promise<number[][]> {

    const result = await this.model.batchEmbedContents({
      requests: chunks.map((text) => ({
        content: {
          role: "user",
          parts: [{
            text
          }]
        },
        outputDimensionality: 1536  // ✅ Add this line!        
      })),
    });

    return result.embeddings.map((e) => e.values);
  }

}
