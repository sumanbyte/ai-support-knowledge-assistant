import { ApiProperty } from "@nestjs/swagger";

export class ChatSourceDto {
    @ApiProperty({ type: Number })
    citationNumber: number;

    @ApiProperty({ type: Number })
    matchScore: number;

    @ApiProperty({ type: String })
    fileName: string;

    @ApiProperty({ type: String })
    cloudinaryUrl: string;

    @ApiProperty({ type: String })
    documentId: string;

    @ApiProperty({ type: Number })
    numberOfPages: number;

    @ApiProperty({ type: String })
    snippet: string;
}

export class ChatResponseDto {
    @ApiProperty({ type: Boolean })
    success: boolean;

    @ApiProperty({ type: String })
    response: string;

    @ApiProperty({ type: [ChatSourceDto] })
    sources: ChatSourceDto[];
}