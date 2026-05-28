import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  type UploadApiOptions,
  type UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import { AppConfig } from '../../config/app.config';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  bytes: number;
  format: string;
  resourceType: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private configured = false;

  constructor(private readonly appConfig: AppConfig) {
    this.configure();
  }

  private configure() {
    const { cloudName, apiKey, apiSecret } = this.appConfig.cloudinary;
    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.warn(
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      );
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    this.configured = true;
  }

  private assertConfigured() {
    if (!this.configured) {
      throw new BadRequestException(
        'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment.',
      );
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryUploadResult> {
    this.assertConfigured();

    if (!file.buffer?.length) {
      throw new BadRequestException('File buffer is empty');
    }

    const isPdf = file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf');
    const resourceType = isPdf ? 'raw' : 'auto';

    try {
      const result = await this.uploadBuffer(file.buffer, {
        folder: this.appConfig.cloudinary.folder,
        resource_type: resourceType,
        public_id: this.buildPublicId(file.originalname),
      });

      return this.toUploadResult(result);
    } catch (error) {
      this.logger.error('Cloudinary upload failed', error);
      throw new InternalServerErrorException('Failed to upload file to Cloudinary');
    }
  }

  async deleteFile(publicId: string, resourceType: 'image' | 'raw' | 'video' | 'auto' = 'raw') {
    this.assertConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }

  private buildPublicId(originalName: string): string {
    const base = originalName.replace(/\.[^/.]+$/, '').replace(/[^\w-]+/g, '_');
    return `${base}_${Date.now()}`;
  }

  private uploadBuffer(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error('Cloudinary returned no result'));
        else resolve(result);
      });

      Readable.from(buffer).pipe(upload);
    });
  }

  private toUploadResult(result: UploadApiResponse): CloudinaryUploadResult {
    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      resourceType: result.resource_type,
    };
  }
}
