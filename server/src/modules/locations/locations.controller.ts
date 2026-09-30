import { Controller, Get, Header, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { NO_STORE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';
import { paginate, type PaginatedResponse } from '../../common/pagination/paginated-response.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import { ListLocationsQueryDto } from './dto/list-locations-query.dto.js';
import type { LocationResponseDto } from './dto/location-response.dto.js';
import { RandomLocationsQueryDto } from './dto/random-locations-query.dto.js';
import { LocationsService } from './locations.service.js';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    async list(
        @Query() query: ListLocationsQueryDto,
        @Req() request: Request
    ): Promise<PaginatedResponse<LocationResponseDto>> {
        const { items, total } = await this.locationsService.list(query);

        return paginate(items, total, query, {
            path: `${request.baseUrl}${request.path}`,
            query: request.query,
        });
    }

    @Get('random')
    @Header('Cache-Control', NO_STORE_CACHE_CONTROL)
    findRandom(@Query() query: RandomLocationsQueryDto): Promise<LocationResponseDto[]> {
        return this.locationsService.findRandom(query.count);
    }

    @Get('slug/:slug')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findBySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<LocationResponseDto> {
        return this.locationsService.findBySlug(slug);
    }

    @Get(':id')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findById(@Param('id', ParseIdPipe) id: number): Promise<LocationResponseDto> {
        return this.locationsService.findById(id);
    }
}
