import { Controller, Get, Header, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { NO_STORE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';
import { paginate, type PaginatedResponse } from '../../common/pagination/paginated-response.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import type { EpisodeResponseDto } from './dto/episode-response.dto.js';
import { ListEpisodesQueryDto } from './dto/list-episodes-query.dto.js';
import { RandomEpisodesQueryDto } from './dto/random-episodes-query.dto.js';
import { EpisodesService } from './episodes.service.js';

@Controller('episodes')
export class EpisodesController {
    constructor(private readonly episodesService: EpisodesService) {}

    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    async list(
        @Query() query: ListEpisodesQueryDto,
        @Req() request: Request
    ): Promise<PaginatedResponse<EpisodeResponseDto>> {
        const { items, total } = await this.episodesService.list(query);

        return paginate(items, total, query, {
            path: `${request.baseUrl}${request.path}`,
            query: request.query,
        });
    }

    @Get('random')
    @Header('Cache-Control', NO_STORE_CACHE_CONTROL)
    findRandom(@Query() query: RandomEpisodesQueryDto): Promise<EpisodeResponseDto[]> {
        return this.episodesService.findRandom(query.count);
    }

    @Get('slug/:slug')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findBySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<EpisodeResponseDto> {
        return this.episodesService.findBySlug(slug);
    }

    @Get(':id')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findById(@Param('id', ParseIdPipe) id: number): Promise<EpisodeResponseDto> {
        return this.episodesService.findById(id);
    }
}
