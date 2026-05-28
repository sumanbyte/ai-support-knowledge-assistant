import { BadRequestException, Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import { ChunkingService } from '../chunking/chunking.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

export interface ProcessDocumentInput {
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
  ) {}

  create(_createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  findAll() {
    return `This action returns all documents`;
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
    const { buffer, fileName, cloudinaryUrl, publicId } = input;

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

    console.log(savedEmbeddings);

    return {
      message: 'Document processed.',
      chunks: chunks.length,
      cloudinaryUrl,
      publicId,
    };
  }
}
