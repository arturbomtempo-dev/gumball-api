import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import { STATUS_CODES } from 'node:http';
import type { ErrorResponse } from './error-response.interface.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(exception);
        }

        const body: ErrorResponse = {
            statusCode,
            error: STATUS_CODES[statusCode] ?? 'Error',
            message: this.resolveMessage(exception, statusCode),
            path: request.originalUrl,
            timestamp: new Date().toISOString(),
        };

        httpAdapter.reply(context.getResponse(), body, statusCode);
    }

    private resolveMessage(exception: unknown, statusCode: number): string | string[] {
        if (!(exception instanceof HttpException)) {
            return 'Internal server error';
        }

        const response = exception.getResponse();

        if (typeof response === 'string') {
            return response;
        }

        if (
            typeof response === 'object' &&
            'message' in response &&
            (typeof response.message === 'string' || Array.isArray(response.message))
        ) {
            return response.message as string | string[];
        }

        return STATUS_CODES[statusCode] ?? exception.message;
    }
}
