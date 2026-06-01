import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageDto } from './chat-message.dto';

export class PaginatedChatMessageDto {
  @ApiProperty({ type: [ChatMessageDto] })
  data: ChatMessageDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
