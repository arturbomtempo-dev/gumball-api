import { Controller, Get, Header, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { NO_STORE_CACHE_CONTROL, PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';
import { paginate, type PaginatedResponse } from '../../common/pagination/paginated-response.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import { CharactersService } from './characters.service.js';
import type { CharacterResponseDto } from './dto/character-response.dto.js';
import { ListCharactersQueryDto } from './dto/list-characters-query.dto.js';
import { RandomCharactersQueryDto } from './dto/random-characters-query.dto.js';

@Controller('characters')
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) {}

    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    async list(
        @Query() query: ListCharactersQueryDto,
        @Req() request: Request
    ): Promise<PaginatedResponse<CharacterResponseDto>> {
        const { items, total } = await this.charactersService.list(query);

        return paginate(items, total, query, {
            path: `${request.baseUrl}${request.path}`,
            query: request.query,
        });
    }

    @Get('random')
    @Header('Cache-Control', NO_STORE_CACHE_CONTROL)
    findRandom(@Query() query: RandomCharactersQueryDto): Promise<CharacterResponseDto[]> {
        return this.charactersService.findRandom(query.count);
    }

    @Get('slug/:slug')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findBySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<CharacterResponseDto> {
        return this.charactersService.findBySlug(slug);
    }

    @Get(':id')
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    findById(@Param('id', ParseIdPipe) id: number): Promise<CharacterResponseDto> {
        return this.charactersService.findById(id);
    }
}
