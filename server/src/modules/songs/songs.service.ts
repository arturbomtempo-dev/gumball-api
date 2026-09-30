import { Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import type { ListSongsQueryDto, SongSortField } from './dto/list-songs-query.dto.js';
import type { SongResponseDto } from './dto/song-response.dto.js';
import { songTypeCodec } from './song.enums.js';
import { SongMapper } from './song.mapper.js';
import { SongsRepository } from './songs.repository.js';

export interface SongPage {
    items: SongResponseDto[];
    total: number;
}

@Injectable()
export class SongsService {
    constructor(private readonly repository: SongsRepository) {}

    async list(query: ListSongsQueryDto): Promise<SongPage> {
        const sort = parseSort<SongSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                type: query.type && songTypeCodec.toDatabase(query.type),
                episodeId: query.episodeId,
                season: query.season,
                characterId: query.characterId,
                vocalist: query.vocalist,
                genre: query.genre,
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: items.map(SongMapper.toResponse), total };
    }

    async findById(id: number): Promise<SongResponseDto> {
        const song = await this.repository.findById(id);

        if (!song) {
            throw new NotFoundException(`Song with id ${id} not found`);
        }

        return SongMapper.toResponse(song);
    }

    async findBySlug(slug: string): Promise<SongResponseDto> {
        const song = await this.repository.findBySlug(slug);

        if (!song) {
            throw new NotFoundException(`Song with slug "${slug}" not found`);
        }

        return SongMapper.toResponse(song);
    }

    async findRandom(count: number): Promise<SongResponseDto[]> {
        const songs = await this.repository.findRandom(count);

        return songs.map(SongMapper.toResponse);
    }
}
