import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : undefined;
    const body = typeof raw === 'object' && raw !== null ? raw as { message?: string | string[]; code?: string } : {};
    response.status(status).json({ statusCode: status, code: body.code ?? (status === 400 ? 'VALIDATION_ERROR' : status === 401 ? 'UNAUTHORIZED' : 'INTERNAL_ERROR'), message: Array.isArray(body.message) ? body.message[0] : body.message ?? 'An unexpected error occurred.' });
  }
}
