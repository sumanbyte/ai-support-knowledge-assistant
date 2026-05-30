import { ApiProperty } from '@nestjs/swagger';


export class DocumentAnalyticsResponseDto {
    @ApiProperty({ type: Number })
    totalDocuments: number;
    @ApiProperty({ type: Number })
    indexSize: number;
    @ApiProperty({ type: Number })
    averageRelevanceScore: number;
    @ApiProperty({ type: Number })
    dimension: number;
    @ApiProperty({ type: Number })
    namespaces: number;
    @ApiProperty({ type: Number })
    uptimePercentage: number;
    @ApiProperty({ type: Number })
    averageQueryLatency: number;
}


