import { BadRequestException, Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import { ChunkingService } from '../chunking/chunking.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '@/generated/prisma/client';
import { PrismaService } from '../auth/prisma/prisma.service';
import { DocumentDto, DocumentResponseDto, DocumentStatus } from './dto/document-response.dto';

export interface ProcessDocumentInput {
  documentId: string;
  buffer: Buffer;
  fileName?: string;
  cloudinaryUrl?: string;
  publicId?: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingsService,
    private readonly vectorService: VectorService,
    private readonly prismaService: PrismaService,
  ) { }

  create(_createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  async findAll(user: Omit<User, 'password'>): Promise<DocumentResponseDto> {
    const rows = await this.prismaService.document.findMany({
      where: { userId: user.id },
    });
    const documents: DocumentDto[] = rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
    return { documents };
  }


  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, _updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }

  async processDocument(input: ProcessDocumentInput) {
    const { buffer, fileName, cloudinaryUrl, publicId, documentId } = input;
    try {
      if (!documentId) {
        throw new BadRequestException('Document ID is required to process the document');
      }
      if (!buffer?.length) {
        throw new BadRequestException('Document buffer is empty');
      }

      console.log('Processing document:', fileName ?? publicId ?? 'unknown');
      if (cloudinaryUrl) {
        console.log('Cloudinary URL:', cloudinaryUrl);
      }

      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();

      const chunks = this.chunkingService.chunkText(pdfData.text);
      const embeddings = await this.embeddingService.generateEmbeddings(chunks);
      const savedEmbeddings = await this.vectorService.saveVectorEmbeddings(
        chunks,
        embeddings,
      );

      await this.prismaService.document.update({
        where: { id: documentId },
        data: {
          status: DocumentStatus.INDEXED,
          chunks: chunks.length,
        },
      })

      console.log(savedEmbeddings);

      return {
        message: 'Document processed.',
        chunks: chunks.length,
        cloudinaryUrl,
        publicId,
      };
    }
    catch (error) {
      // 3. 🚨 SAFETY NET: Catch any failure in the pipeline instantly
      console.error(`Failed to process document ${documentId}:`, error);

      await this.prismaService.document.update({
        where: { id: documentId },
        data: {
          status: DocumentStatus.ERROR,
        },
      });
    }
  }
}
