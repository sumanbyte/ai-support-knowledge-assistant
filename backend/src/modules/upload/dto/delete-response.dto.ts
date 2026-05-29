import { DocumentDto } from '@/generated/api-dtos';
import { createGenericResponseDto } from '@/src/common/dto-spec/common-dto';


/** Swagger schema class (runtime value). */
export const DeleteResponseDto = createGenericResponseDto(DocumentDto, 'DeleteResponseDto');

