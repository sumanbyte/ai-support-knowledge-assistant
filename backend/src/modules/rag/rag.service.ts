import { Injectable } from '@nestjs/common';
import { CreateRagDto } from './dto/create-rag.dto';
import { UpdateRagDto } from './dto/update-rag.dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { GeminiService } from '../gemini/gemini.service';
import { SYSTEM_PROMPT } from './prompts/system.prompt';

@Injectable()
export class RagService {

  constructor(
    private readonly embeddingService: EmbeddingsService,
    private readonly vectorService: VectorService,
    private readonly geminiService: GeminiService
  ) {

  }

  create(createRagDto: CreateRagDto) {
    return 'This action adds a new rag';
  }

  findAll() {
    return `This action returns all rag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rag`;
  }

  update(id: number, updateRagDto: UpdateRagDto) {
    return `This action updates a #${id} rag`;
  }

  remove(id: number) {
    return `This action removes a #${id} rag`;
  }

  async generateResponse(
    contextQuery: string,
  ) {

    const generatedResponse = await this.geminiService.generateResponse(contextQuery, SYSTEM_PROMPT);

    return generatedResponse;

  }


}
