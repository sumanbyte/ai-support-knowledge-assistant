import { ApiProperty } from "@nestjs/swagger";

class UploadedFileInfoDto {
    @ApiProperty({ description: 'Public ID' })
    publicId: string;

    @ApiProperty({ description: 'URL' })
    url: string;

    @ApiProperty({ description: 'Format' })
    format: string;

    @ApiProperty({ description: 'Bytes' })
    bytes: number;
}

export class UploadResponseDto {
    @ApiProperty({ description: 'Success' })
    success: boolean;

    @ApiProperty({ description: 'Message' })
    message: string;

    @ApiProperty({ description: 'File', type: UploadedFileInfoDto })
    file: UploadedFileInfoDto;
}