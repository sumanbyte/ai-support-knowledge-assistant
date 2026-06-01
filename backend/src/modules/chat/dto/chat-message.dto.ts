import { ChatMessageRole } from "@/generated/prisma/enums";
import { ApiProperty } from "@nestjs/swagger";


export class ChatMessageDto {
    @ApiProperty({ description: 'The ID of the chat message' })
    id: string;

    @ApiProperty({ description: 'The content of the chat message' })
    content: string;

    @ApiProperty({ enum: ChatMessageRole, description: 'The role of the chat message' })
    role: ChatMessageRole;

    @ApiProperty({ description: 'The creation date of the chat message' })
    createdAt: Date;

    @ApiProperty({ description: 'The last update date of the chat message' })
    updatedAt: Date;
}
