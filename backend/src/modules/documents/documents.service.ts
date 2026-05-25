import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import fs from "fs/promises";
import { PDFParse } from "pdf-parse"
import { ChunkingService } from '../chunking/chunking.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';

@Injectable()
export class DocumentsService {

  constructor(
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingsService,
    private readonly vectorService: VectorService
  ) { }

  create(createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }

  async processDocument(filePath: string) {
    console.log('Processing:', filePath);

    // read file
    const fileBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    const pdfData = await parser.getText();

    const chunks = this.chunkingService.chunkText(pdfData.text);

    //generate embeddings
    const embeddings = await this.embeddingService.generateEmbeddings(chunks);

    const savedEmbeddings = await this.vectorService.saveVectorEmbeddings(chunks, embeddings);

    console.log(savedEmbeddings)

    return "Document process initiated."
  }
}
