import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class UploadService {

  constructor(
    private readonly documentService: DocumentsService
  ) { }

  async create(createUploadDto: CreateUploadDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.documentService.processDocument(file.path);

    return {
      success: true,
      message: "Processing has been started."
    };
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
