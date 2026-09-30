import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller.js';
import { LocationsRepository } from './locations.repository.js';
import { LocationsService } from './locations.service.js';

@Module({
    controllers: [LocationsController],
    providers: [LocationsRepository, LocationsService],
})
export class LocationsModule {}
