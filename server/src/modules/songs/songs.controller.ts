import { Controller, Get, Header, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { NO_STORE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';
import { paginate, type PaginatedResponse } from '../../common/pagination/paginated-response.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import { ListSongsQueryDto } from './dto/list-songs-query.dto.js';
import { RandomSongsQueryDto } from './dto/random-songs-query.dto.js';
import type { SongResponseDto } from './dto/song-response.dto.js';
import { SongsService } from './songs.service.js';

@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) {}

    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    async list(
        @Query() query: ListSongsQueryDto,
        @Req() request: Request
    ): Promise<PaginatedResponse<SongResponseDto>> {
        const { items, total } = await this.songsService.list(query);

        return paginate(items, total, query, {
            path: `${request.baseUrl}${request.path}`,
            query: request.query,
        });
    }

    @Get('random')
    @Header('Cache-Control', NO_STORE_CACHE_CONTROL)
    findRandom(@Query() query: RandomSongsQueryDto): Promise<SongResponseDto[]> {
        return this.songsService.findRandom(query.count);
    }

    @Get('slug/:slug')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findBySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<SongResponseDto> {
        return this.songsService.findBySlug(slug);
    }

    @Get(':id')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findById(@Param('id', ParseIdPipe) id: number): Promise<SongResponseDto> {
        return this.songsService.findById(id);
    }
}
