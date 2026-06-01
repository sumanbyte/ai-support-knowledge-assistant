import { ApiProperty } from '@nestjs/swagger';
import { ChatDto } from './chat.dto';

export class PaginatedChatDto {
  @ApiProperty({ type: [ChatDto] })
  data: ChatDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
