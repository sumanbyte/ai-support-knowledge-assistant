import { ApiProperty } from "@nestjs/swagger";
import { ChatMessageDto } from "./chat-message.dto";



export class ChatDto {

    @ApiProperty({ description: 'The ID of the chat' })
    id: string;

    @ApiProperty({ description: 'The name of the chat' })
    name: string;

    @ApiProperty({ type: [ChatMessageDto], description: 'Messages in the chat' })
    chatMessages: ChatMessageDto[];

    @ApiProperty({ description: 'The number of messages in the chat' })
    messageCount: number;

    @ApiProperty({ description: 'The creation date of the chat' })
    createdAt: Date;

    @ApiProperty({ description: 'The last update date of the chat' })
    updatedAt: Date;
}