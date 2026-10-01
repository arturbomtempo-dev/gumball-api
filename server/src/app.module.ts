import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { buildLoggerConfig } from './bootstrap/logger.config.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { AppConfigModule } from './config/app-config.module.js';
import { AppConfigService } from './config/app-config.service.js';
import { DatabaseModule } from './database/database.module.js';
import { CharactersModule } from './modules/characters/characters.module.js';
import { EpisodesModule } from './modules/episodes/episodes.module.js';
import { GamesModule } from './modules/games/games.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { LocationsModule } from './modules/locations/locations.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { SeasonsModule } from './modules/seasons/seasons.module.js';
import { SongsModule } from './modules/songs/songs.module.js';

@Module({
    imports: [
        AppConfigModule,
        LoggerModule.forRootAsync({
            inject: [AppConfigService],
            useFactory: buildLoggerConfig,
        }),
        ThrottlerModule.forRootAsync({
            inject: [AppConfigService],
            useFactory: (config: AppConfigService) => ({
                throttlers: [
                    {
                        ttl: config.get('THROTTLE_TTL_MS'),
                        limit: config.get('THROTTLE_LIMIT'),
                    },
                ],
            }),
        }),
        DatabaseModule,
        HealthModule,
        CharactersModule,
        LocationsModule,
        EpisodesModule,
        SeasonsModule,
        SongsModule,
        GamesModule,
        MediaModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
    ],
})
export class AppModule {}
