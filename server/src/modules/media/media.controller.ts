import { Controller, Get, Header, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { NO_STORE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';
import { paginate, type PaginatedResponse } from '../../common/pagination/paginated-response.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import { ListMediaQueryDto } from './dto/list-media-query.dto.js';
import type { MediaResponseDto } from './dto/media-response.dto.js';
import { RandomMediaQueryDto } from './dto/random-media-query.dto.js';
import { MediaService } from './media.service.js';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    async list(
        @Query() query: ListMediaQueryDto,
        @Req() request: Request
    ): Promise<PaginatedResponse<MediaResponseDto>> {
        const { items, total } = await this.mediaService.list(query);

        return paginate(items, total, query, {
            path: `${request.baseUrl}${request.path}`,
            query: request.query,
        });
    }

    @Get('random')
    @Header('Cache-Control', NO_STORE_CACHE_CONTROL)
    findRandom(@Query() query: RandomMediaQueryDto): Promise<MediaResponseDto[]> {
        return this.mediaService.findRandom(query.count);
    }

    @Get('slug/:slug')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findBySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<MediaResponseDto> {
        return this.mediaService.findBySlug(slug);
    }

    @Get(':id')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findById(@Param('id', ParseIdPipe) id: number): Promise<MediaResponseDto> {
        return this.mediaService.findById(id);
    }
}
