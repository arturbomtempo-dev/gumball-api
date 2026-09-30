import { Module } from '@nestjs/common';
import { SeasonsController } from './seasons.controller.js';
import { SeasonsRepository } from './seasons.repository.js';
import { SeasonsService } from './seasons.service.js';

@Module({
    controllers: [SeasonsController],
    providers: [SeasonsRepository, SeasonsService],
})
export class SeasonsModule {}
