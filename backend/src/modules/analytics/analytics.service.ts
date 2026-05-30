import { Injectable } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { PrismaService } from '../auth/prisma/prisma.service';
import { VectorService } from '../vector/vector.service';

@Injectable()
export class AnalyticsService {


  constructor(private readonly prismaService: PrismaService, private readonly vectorService: VectorService) { }

  create(createAnalyticsDto: CreateAnalyticsDto) {
    return 'This action adds a new analytics';
  }

  findAll() {
    return `This action returns all analytics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analytics`;
  }

  update(id: number, updateAnalyticsDto: UpdateAnalyticsDto) {
    return `This action updates a #${id} analytics`;
  }

  remove(id: number) {
    return `This action removes a #${id} analytics`;
  }

  async getDocumentsAnalytics(userId: string) {
    const [totalDocuments, indexSize, indexInfo, uptimePercentage, averageQueryLatency] = await Promise.all([
      this.prismaService.document.count({
        where: { userId }
      }),
      this.prismaService.document.aggregate({
        where: { userId },
        _sum: {
          size: true
        }
      }),
      this.vectorService.getIndexInfo(),
      this.vectorService.getUptimePercentage(),
      this.vectorService.getAverageQueryLatency()
    ])

    const averageRelevanceScore = 0

    return {
      totalDocuments,
      indexSize: indexSize._sum.size,
      averageRelevanceScore,
      dimension: indexInfo.dimension,
      namespaces: Object.keys(indexInfo.namespaces).length,
      uptimePercentage,
      averageQueryLatency
    }
  }
}
