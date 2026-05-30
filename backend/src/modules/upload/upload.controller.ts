import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, UseFilters } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { GetUser } from '../auth/decorators/current-user.decorator';
import { User } from '@/generated/prisma/client';
import { UploadResponseDto } from './dto/upload-response.dto';
import { MulterUploadExceptionFilter } from './multer-upload.exception-filter';
import { DeleteResponseDto } from './dto/delete-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }


  @ApiOperation({ summary: 'Upload a file' })
  @ApiBody({ type: CreateUploadDto })
  @ApiCreatedResponse({ description: 'File uploaded successfully' })
  @ApiResponse({ type: UploadResponseDto })
  @Post('/file')
  @UseFilters(MulterUploadExceptionFilter)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUploadDto: CreateUploadDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: Omit<User, 'password'>,
  ) {
    return this.uploadService.create(createUploadDto, file, user);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteResponseDto })
  async remove(
    @Param('id') id: string,
    @Body("public_id") publicId: string,
    @GetUser("id") userId: string
  ) {
    return this.uploadService.remove(id, publicId, userId);
  }
}
