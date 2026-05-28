import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

export const ALLOWED_UPLOAD_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'pdf',
] as const;

export const ALLOWED_FILE_TYPES_MESSAGE = `Only ${ALLOWED_UPLOAD_EXTENSIONS.join(', ').toUpperCase()} files are allowed.`;

const EXTENSION_PATTERN = /\.(jpg|jpeg|png|gif|pdf)$/i;

/**
 * Rejects disallowed types with BadRequestException (handled by MulterUploadExceptionFilter).
 */
export function uploadFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (!EXTENSION_PATTERN.test(file.originalname)) {
    return callback(
      new BadRequestException(ALLOWED_FILE_TYPES_MESSAGE) as unknown as Error,
      false,
    );
  }
  callback(null, true);
}
