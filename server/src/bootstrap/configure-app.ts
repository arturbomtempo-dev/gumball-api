import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { AppConfigService } from '../config/app-config.service.js';

export function configureApp(app: NestExpressApplication): void {
    const config = app.get(AppConfigService);

    app.set('trust proxy', config.get('TRUST_PROXY_HOPS'));
    app.disable('x-powered-by');

    app.use(helmet());
    app.use(compression());

    app.enableCors({
        origin: config.corsOrigins,
        methods: ['GET', 'HEAD', 'OPTIONS'],
        maxAge: 86_400,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    app.enableShutdownHooks();
}
