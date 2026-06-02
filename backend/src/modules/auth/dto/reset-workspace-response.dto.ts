import { ApiProperty } from '@nestjs/swagger';

export class ResetWorkspaceResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  deletedDocuments: number;

  @ApiProperty()
  deletedChats: number;

  @ApiProperty()
  deletedPipelineLogs: number;
}
