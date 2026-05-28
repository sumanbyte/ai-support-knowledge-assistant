import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { MulterError } from 'multer';
import { ALLOWED_FILE_TYPES_MESSAGE } from './upload-file.filter';

@Catch(MulterError, BadRequestException)
export class MulterUploadExceptionFilter implements ExceptionFilter {
  catch(
    exception: MulterError | BadRequestException,
    host: ArgumentsHost,
  ) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      return res.status(status).json(body);
    }

    if (exception instanceof MulterError) {
      if (exception.code === 'LIMIT_FILE_SIZE') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File is too large. Maximum size is 10 MB.',
          error: 'Bad Request',
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ALLOWED_FILE_TYPES_MESSAGE,
        error: 'Bad Request',
      });
    }
  }
}
