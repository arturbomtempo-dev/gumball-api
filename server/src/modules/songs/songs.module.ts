import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller.js';
import { SongsRepository } from './songs.repository.js';
import { SongsService } from './songs.service.js';

@Module({
    controllers: [SongsController],
    providers: [SongsRepository, SongsService],
})
export class SongsModule {}
