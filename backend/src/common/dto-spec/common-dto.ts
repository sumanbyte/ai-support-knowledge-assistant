import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/** Shape of standard API responses (use for typing services/controllers). */
export type GenericResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

/**
 * Builds a Swagger DTO for `{ success, message, data }`.
 * Pass the nested DTO class so OpenAPI gets a concrete schema (generics have no runtime value).
 */
export function createGenericResponseDto<T>(dataType: Type<T>
    , schemaName?: string
) {
    class GenericResponseDto implements GenericResponse<T> {
        @ApiProperty({ description: 'Success' })
        success: boolean;

        @ApiProperty({ description: 'Message' })
        message: string;

        @ApiProperty({ description: 'Data', type: dataType })
        data: T;
    }

    if (schemaName) {
        Object.defineProperty(GenericResponseDto, 'name', { value: schemaName });
    }

    return GenericResponseDto;
}
