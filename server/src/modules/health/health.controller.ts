import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { DatabaseHealthIndicator } from './database.health.js';

@SkipThrottle()
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly databaseHealth: DatabaseHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([() => this.databaseHealth.isHealthy('database')]);
    }
}
