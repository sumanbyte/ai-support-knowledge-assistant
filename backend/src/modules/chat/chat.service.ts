import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { RagService } from '../rag/rag.service';
import { PrismaService } from '../auth/prisma/prisma.service';
import { ChatMessageRole } from '@/generated/prisma/enums';
import { PaginationQueryDto } from '@/src/common/dto-spec/pagination-query.dto';

@Injectable()
export class ChatService {

  constructor(private readonly embeddingService: EmbeddingsService,
    private readonly vectorService: VectorService,
    private readonly ragService: RagService,
    private readonly prismaService: PrismaService
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

  async askAssistant(userQuestion: string, userId: string, chatId: string) {
    console.log("Asking assistant for user:", userId);
    const [queryEmbedding] = await this.embeddingService.generateEmbeddings([userQuestion]);

    const contextChunks = await this.vectorService.searchSimilarChunks(queryEmbedding, 3, userId);

    console.log("Is queryEmbedding an array?", Array.isArray(queryEmbedding));
    console.log("Query Embedding Dimensions Count:", queryEmbedding?.length);

    console.log("Context chunks:", contextChunks);
    const contextText = contextChunks.map(c => c.text).join("\n\n");

    const response = await this.ragService.generateResponse(contextText)

    let newChatId;
    if (!chatId) {
      newChatId = await this.prismaService.chat.create({
        data: {
          userId,
          chatMessages: {
            create: {

              content: userQuestion,
              role: ChatMessageRole.USER
            }
          }

        }
      })
    } else {
      await this.prismaService.chatMessage.create({
        data: {
          content: userQuestion,
          role: ChatMessageRole.USER,
          chatId
        }
      })
    }

    await this.prismaService.chatMessage.create({
      data: {
        content: response,
        role: ChatMessageRole.ASSISTANT,
        chatId: chatId ?? newChatId?.id,

      }
    })



    return {
      success: true,
      chatId: newChatId?.id ?? chatId,
      response,
      sources: contextChunks.map((chunk, index) => ({
        citationNumber: index + 1,
        fileName: chunk.fileName,
        matchScore: Math.round(chunk.score * 100),
        cloudinaryUrl: chunk.cloudinaryUrl,
        documentId: chunk.documentId,
        snippet: (chunk.text as string).substring(0, 180),
        numberOfPages: chunk.numberOfPages,
      }))
    };
  }



  async getChatHistory(userId: string, paginationQuery: PaginationQueryDto) {
    const [chats, total] = await Promise.all([
      this.prismaService.chat.findMany({
        where: { userId },
        skip: paginationQuery.skip,
        take: paginationQuery.limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          // Preview only (for list subtitle)
          chatMessages: {
            take: 1,
            where: { role: ChatMessageRole.USER },
          },
          // Full count — NOT limited by take above
          _count: {
            select: { chatMessages: true },
          },
        },
      }),
      this.prismaService.chat.count({ where: { userId } }),
    ]);

    return {
      data: chats.map((chat) => ({
        id: chat.id,
        name: chat.name,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        chatMessages: chat.chatMessages,
        messageCount: chat._count.chatMessages,
      })),
      total,
      page: paginationQuery.page,
      limit: paginationQuery.limit,
      totalPages: Math.ceil(total / (paginationQuery.limit ?? 10)),
    };

  }

  async getChatMessages(
    chatid: string,
    paginationQuery: PaginationQueryDto
  ) {
    const [messages, total] = await Promise.all([
      this.prismaService.chatMessage.findMany({
        where: {
          chatId: chatid
        },
        skip: paginationQuery.skip,
        take: paginationQuery.limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prismaService.chatMessage.count({
        where: {
          chatId: chatid
        }
      })
    ]);



    if (!messages) {
      throw new NotFoundException('Messages not found for chat');
    }

    return {
      data: messages,
      total,
      page: paginationQuery.page,
      limit: paginationQuery.limit,
      totalPages: Math.ceil(total / (paginationQuery.limit ?? 10))
    }
  }
}
