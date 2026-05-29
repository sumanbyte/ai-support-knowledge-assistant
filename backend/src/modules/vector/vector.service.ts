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

  async deleteVectorEmbeddings(documentId: string) {
    try {
      // Metadata fields are filtered by key name directly (not "metadata.documentId").
      // See https://upstash.com/docs/vector/features/filtering
      const result = await this.upstashIndex.delete({
        filter: `documentId = '${documentId}'`,
      });
      console.log(
        `Upstash: deleted ${result.deleted} vector(s) for document ${documentId}`,
      );
      return { success: true, count: result.deleted };
    } catch (error) {
      console.error('Upstash delete error:', error);
      return { success: false, count: 0 };
    }
  }

  async saveVectorEmbeddings(chunks: string[], vectors: number[][], documentId: string, fileName: string) {
    const dataToUpsert = chunks.map((text, index) => ({
      id: `chunk-${Date.now()}-${index}`,
      vector: vectors[index],
      metadata: { text, documentId, fileName }
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
