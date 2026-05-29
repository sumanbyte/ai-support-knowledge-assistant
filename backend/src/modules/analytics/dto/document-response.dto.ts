import { ApiProperty } from '@nestjs/swagger';


export class DocumentAnalyticsResponseDto {
    @ApiProperty({ type: Number })
    totalDocuments: number;
    @ApiProperty({ type: Number })
    indexSize: number;
    @ApiProperty({ type: Number })
    averageRelevanceScore: number;
}


