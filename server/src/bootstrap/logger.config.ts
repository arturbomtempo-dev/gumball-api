import type { Params } from 'nestjs-pino';
import type { AppConfigService } from '../config/app-config.service.js';

export function buildLoggerConfig(config: AppConfigService): Params {
    return {
        pinoHttp: {
            level: config.get('LOG_LEVEL'),
            transport: config.isProduction
                ? undefined
                : { target: 'pino-pretty', options: { singleLine: true } },
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            customProps: () => ({ context: 'HTTP' }),
        },
    };
}
