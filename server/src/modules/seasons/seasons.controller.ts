import { Controller, Get, Header, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { NO_STORE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';
import { paginate, type PaginatedResponse } from '../../common/pagination/paginated-response.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import { ListSeasonsQueryDto } from './dto/list-seasons-query.dto.js';
import { RandomSeasonsQueryDto } from './dto/random-seasons-query.dto.js';
import type { SeasonResponseDto } from './dto/season-response.dto.js';
import { SeasonsService } from './seasons.service.js';

@Controller('seasons')
export class SeasonsController {
    constructor(private readonly seasonsService: SeasonsService) {}

    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    async list(
        @Query() query: ListSeasonsQueryDto,
        @Req() request: Request
    ): Promise<PaginatedResponse<SeasonResponseDto>> {
        const { items, total } = await this.seasonsService.list(query);

        return paginate(items, total, query, {
            path: `${request.baseUrl}${request.path}`,
            query: request.query,
        });
    }

    @Get('random')
    @Header('Cache-Control', NO_STORE_CACHE_CONTROL)
    findRandom(@Query() query: RandomSeasonsQueryDto): Promise<SeasonResponseDto[]> {
        return this.seasonsService.findRandom(query.count);
    }

    @Get('slug/:slug')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findBySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<SeasonResponseDto> {
        return this.seasonsService.findBySlug(slug);
    }

    @Get(':id')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findById(@Param('id', ParseIdPipe) id: number): Promise<SeasonResponseDto> {
        return this.seasonsService.findById(id);
    }
}
