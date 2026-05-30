import { ApiProperty } from "@nestjs/swagger";



export class ChatResponseDto {
    @ApiProperty({ type: Boolean })
    success: boolean;

    @ApiProperty({ type: String })
    response: string;
}