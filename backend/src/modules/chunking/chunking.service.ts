import { Injectable } from '@nestjs/common';
import { CreateChunkingDto } from './dto/create-chunking.dto';
import { UpdateChunkingDto } from './dto/update-chunking.dto';

@Injectable()
export class ChunkingService {
  create(createChunkingDto: CreateChunkingDto) {
    return 'This action adds a new chunking';
  }

  findAll() {
    return `This action returns all chunking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chunking`;
  }

  update(id: number, updateChunkingDto: UpdateChunkingDto) {
    return `This action updates a #${id} chunking`;
  }

  remove(id: number) {
    return `This action removes a #${id} chunking`;
  }

  chunkText(
    text: string,
    chunkSize = 800,
    overlap = 150
  ): string[] {
    const chunks: string[] = [];

    let start = 0;

    while (start < text.length) {
      const end = start + chunkSize;
      const chunk = text.slice(start, end);
      chunks.push(chunk);
      start += chunkSize - overlap;
    }

    console.log("Chunks: ", chunks)

    return chunks;
  }
}
