import { Injectable } from '@nestjs/common';
import { CreateVectorDto } from './dto/create-vector.dto';
import { UpdateVectorDto } from './dto/update-vector.dto';
import { Index } from '@upstash/vector';
import { AppConfig } from 'src/config/app.config';
import { PrismaService } from '../auth/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class VectorService {

  private upstashIndex: Index;

  constructor(private readonly appConfig: AppConfig, private readonly prismaService: PrismaService) {
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

  async getIndexInfo() {
    const info = await this.upstashIndex.info();

    return info;
  }

  async deleteVectorEmbeddings(documentId: string, userId: string) {
    try {
      // Metadata fields are filtered by key name directly (not "metadata.documentId").
      // See https://upstash.com/docs/vector/features/filtering
      const result = await this.upstashIndex.delete({
        filter: `documentId = '${documentId}'`,

      }, {
        namespace: userId
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

  async saveVectorEmbeddings(chunks: string[], vectors: number[][],
    documentId: string, fileName: string,
    userId: string, cloudinaryUrl: string, numberOfPages: number) {
    const dataToUpsert = chunks.map((text, index) => ({
      id: `chunk-${Date.now()}-${index}`,
      vector: vectors[index],
      metadata: { text, documentId, fileName, cloudinaryUrl, numberOfPages }
    }));

    await this.upstashIndex.upsert(dataToUpsert, {
      namespace: userId
    });
    console.log({ success: true, count: dataToUpsert.length })
    return { success: true, count: dataToUpsert.length }
  }

  async searchSimilarChunks(queryVector: number[], topK: number, userId: string) {

    console.log("Searching for similar chunks for user:", userId);


    try {
      const results = await this.upstashIndex.namespace(userId).query({
        vector: queryVector,
        topK: topK,
        includeMetadata: true,
      });



      return results.map(match => ({
        id: match.id,
        score: match.score,
        text: match.metadata?.text,
        fileName: match.metadata?.fileName,
        cloudinaryUrl: match.metadata?.cloudinaryUrl,
        documentId: match.metadata?.documentId,
        userId: match.metadata?.userId,
        numberOfPages: match.metadata?.numberOfPages,
      }))
    } catch (error) {
      console.log("Upstash search errror: ", error)
      throw error;
    }
  }


  async getUptimePercentage() {
    const totalHeartbeats = await this.prismaService.ragMetrics.count({
      where: {
        type: "heartbeat"
      }
    })
    const successfulHeartbeats = await this.prismaService.ragMetrics.count({
      where: {
        type: "heartbeat",
        success: true
      }
    })
    return (successfulHeartbeats / totalHeartbeats) * 100;
  }

  async getAverageQueryLatency() {
    const averageQueryLatency = await this.prismaService.ragMetrics.aggregate({
      where: {
        type: "heartbeat",
        success: true
      },
      _avg: {
        queryLatencyMS: true
      }
    })
    return averageQueryLatency._avg.queryLatencyMS?.toFixed(0);
  }



  @Cron('*/5 * * * * *') // every 5 minutes
  async checkSystemUptimePercentage() {
    const start = performance.now();
    try {
      await this.upstashIndex.info();




      await this.prismaService.ragMetrics.create({
        data: {
          success: true,
          type: "heartbeat",
          queryLatencyMS: performance.now() - start,
        }
      })
    } catch (error) {
      await this.prismaService.ragMetrics.create({
        data: {
          success: false,
        }
      })
    }


  }
}
