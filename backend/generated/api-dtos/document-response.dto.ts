// AUTO-GENERATED from prisma/schema.prisma — do not edit by hand.
// Regenerate: pnpm prisma:generate

import { ApiProperty } from '@nestjs/swagger';
import { DocumentDto } from './document.dto';

export class DocumentResponseDto {
  @ApiProperty({ type: [DocumentDto] })
  documents: DocumentDto[];
}
