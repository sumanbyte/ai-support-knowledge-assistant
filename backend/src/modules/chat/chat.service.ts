import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { RagService } from '../rag/rag.service';

@Injectable()
export class ChatService {

  constructor(private readonly embeddingService: EmbeddingsService,
    private readonly vectorService: VectorService,
    private readonly ragService: RagService
  ) { }
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async askAssistant(userQuestion: string, userId: string) {
    console.log("Asking assistant for user:", userId);
    const [queryEmbedding] = await this.embeddingService.generateEmbeddings([userQuestion]);

    const contextChunks = await this.vectorService.searchSimilarChunks(queryEmbedding, 3, userId);

    console.log("Is queryEmbedding an array?", Array.isArray(queryEmbedding));
    console.log("Query Embedding Dimensions Count:", queryEmbedding?.length);

    console.log("Context chunks:", contextChunks);
    const contextText = contextChunks.map(c => c.text).join("\n\n");

    const response = await this.ragService.generateResponse(contextText)

    return {
      success: true,
      response
    };
  }
}
