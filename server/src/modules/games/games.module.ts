import { Module } from '@nestjs/common';
import { GamesController } from './games.controller.js';
import { GamesRepository } from './games.repository.js';
import { GamesService } from './games.service.js';

@Module({
    controllers: [GamesController],
    providers: [GamesRepository, GamesService],
})
export class GamesModule {}
