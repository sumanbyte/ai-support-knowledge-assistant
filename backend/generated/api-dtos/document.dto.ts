// AUTO-GENERATED from prisma/schema.prisma — do not edit by hand.
// Regenerate: pnpm prisma:generate

import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatus } from './document-status.enum';
import { DocumentIcon } from './document-icon.enum';

export class DocumentDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  dept: string;

  @ApiProperty({ enum: Object.values(DocumentStatus), default: "PROCESSING", required: false })
  status?: DocumentStatus;

  @ApiProperty()
  chunks: number;

  @ApiProperty({ enum: Object.values(DocumentIcon) })
  icon: DocumentIcon;

  @ApiProperty()
  url: string;

  @ApiProperty({ format: 'date-time', required: false })
  createdAt?: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiProperty()
  userId: string;

}
