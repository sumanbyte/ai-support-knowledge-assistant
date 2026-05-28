import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DocumentsService } from '../documents/documents.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { PrismaService } from '../auth/prisma/prisma.service';
import { DocumentIcon, DocumentStatus, User } from '@/generated/prisma/client';

@Injectable()
export class UploadService {
  constructor(
    private readonly documentService: DocumentsService,
    private readonly cloudinaryService: CloudinaryService,

    private readonly prismaService: PrismaService,
  ) { }

  async create(_createUploadDto: CreateUploadDto, file: Express.Multer.File, user: Omit<User, 'password'>) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const stored = await this.cloudinaryService.uploadFile(file);

    const isPdf =
      file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');



    const size = file.size / 1024 / 1024;

    const document = await this.prismaService.document.create({
      data: {
        name: file.originalname,
        url: stored.secureUrl,
        userId: user.id,
        size: `${size} MB`,
        dept: "Technology",
        chunks: 0,
        icon: DocumentIcon.PICTURE_AS_PDF,
        status: DocumentStatus.PROCESSING,

      },
    });

    if (isPdf) {
      void this.documentService
        .processDocument({
          buffer: file.buffer,
          fileName: file.originalname,
          cloudinaryUrl: stored.secureUrl,
          publicId: stored.publicId,
          documentId: document.id,
        })
        .catch((err) => {
          console.error('Document processing failed:', err);
        });
    }

    return {
      success: true,
      message: isPdf
        ? 'File stored in Cloudinary. Document processing has started.'
        : 'File stored in Cloudinary.',
      file: {
        publicId: stored.publicId,
        url: stored.secureUrl,
        format: stored.format,
        bytes: stored.bytes,
      },
    };
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, _updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
