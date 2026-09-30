import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller.js';
import { EpisodesRepository } from './episodes.repository.js';
import { EpisodesService } from './episodes.service.js';

@Module({
    controllers: [EpisodesController],
    providers: [EpisodesRepository, EpisodesService],
})
export class EpisodesModule {}
