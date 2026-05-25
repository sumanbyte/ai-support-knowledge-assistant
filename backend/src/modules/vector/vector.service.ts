import { Injectable } from '@nestjs/common';
import { CreateVectorDto } from './dto/create-vector.dto';
import { UpdateVectorDto } from './dto/update-vector.dto';
import { Index } from '@upstash/vector';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class VectorService {

  private upstashIndex: Index;

  constructor(private readonly appConfig: AppConfig) {
    this.upstashIndex = new Index({
      url: appConfig.getEnvConfig().UPSTASH_VECTOR_REST_URL,
      token: appConfig.getEnvConfig().UPSTASH_VECTOR_REST_TOKEN
    })
  }
  create(createVectorDto: CreateVectorDto) {
    return 'This action adds a new vector';
  }

  findAll() {
    return `This action returns all vector`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vector`;
  }

  update(id: number, updateVectorDto: UpdateVectorDto) {
    return `This action updates a #${id} vector`;
  }

  remove(id: number) {
    return `This action removes a #${id} vector`;
  }

  async saveVectorEmbeddings(chunks: string[], vectors: number[][]) {
    const dataToUpsert = chunks.map((text, index) => ({
      id: `chunk-${Date.now()}-${index}`,
      vector: vectors[index],
      metadata: { text }
    }));

    await this.upstashIndex.upsert(dataToUpsert);
    console.log({ success: true, count: dataToUpsert.length })
    return { success: true, count: dataToUpsert.length }
  }

  async searchSimilarChunks(queryVector: number[], topK: number) {
    try {
      const results = await this.upstashIndex.query({
        vector: queryVector,
        topK: topK,
        includeMetadata: true
      });

      return results.map(match => ({
        id: match.id,
        score: match.score,
        text: match.metadata?.text,
        ...match.metadata
      }))
    } catch (error) {
      console.log("Upstash search errror: ", error)
      throw error;
    }
  }
}
