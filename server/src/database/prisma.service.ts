import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppConfigService } from '../config/app-config.service.js';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(config: AppConfigService) {
        const certificateAuthority = config.get('DATABASE_SSL_CA');

        const adapter = new PrismaPg({
            connectionString: config.get('DATABASE_URL'),
            max: config.get('DATABASE_POOL_MAX'),
            ssl: certificateAuthority
                ? {
                      ca: certificateAuthority.replace(/\\n/g, '\n'),
                      rejectUnauthorized: true,
                  }
                : undefined,
        });

        super({ adapter });
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}
