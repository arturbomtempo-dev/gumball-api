import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env.schema.js';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService<Env, true>) {}

    get<TKey extends keyof Env>(key: TKey): Env[TKey] {
        return this.configService.get(key, { infer: true });
    }

    get isProduction(): boolean {
        return this.get('NODE_ENV') === 'production';
    }

    get corsOrigins(): string[] | '*' {
        const origins = this.get('CORS_ORIGINS').trim();

        if (origins === '*') {
            return '*';
        }

        return origins
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean);
    }
}
