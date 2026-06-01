import { Type, mixin } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function PaginatedResponse<T>(ItemDto: Type<T>) {
    class PaginatedResponseClass {
        @ApiProperty({ type: [ItemDto] })
        data: T[];

        @ApiProperty()
        total: number;

        @ApiProperty()
        page: number;

        @ApiProperty()
        limit: number;

        @ApiProperty()
        totalPages: number;
    }

    // mixin assigns a unique name to the dynamically generated class
    return mixin(PaginatedResponseClass);
}
