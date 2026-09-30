import { Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import type { GameResponseDto } from './dto/game-response.dto.js';
import type { GameSortField, ListGamesQueryDto } from './dto/list-games-query.dto.js';
import { gamePlatformCodec, gameStatusCodec } from './game.enums.js';
import { GameMapper } from './game.mapper.js';
import { GamesRepository } from './games.repository.js';

export interface GamePage {
    items: GameResponseDto[];
    total: number;
}

@Injectable()
export class GamesService {
    constructor(private readonly repository: GamesRepository) {}

    async list(query: ListGamesQueryDto): Promise<GamePage> {
        const sort = parseSort<GameSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                platform: query.platform && gamePlatformCodec.toDatabase(query.platform),
                status: query.status && gameStatusCodec.toDatabase(query.status),
                developer: query.developer,
                releaseYear: query.releaseYear,
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: items.map(GameMapper.toResponse), total };
    }

    async findById(id: number): Promise<GameResponseDto> {
        const game = await this.repository.findById(id);

        if (!game) {
            throw new NotFoundException(`Game with id ${id} not found`);
        }

        return GameMapper.toResponse(game);
    }

    async findBySlug(slug: string): Promise<GameResponseDto> {
        const game = await this.repository.findBySlug(slug);

        if (!game) {
            throw new NotFoundException(`Game with slug "${slug}" not found`);
        }

        return GameMapper.toResponse(game);
    }

    async findRandom(count: number): Promise<GameResponseDto[]> {
        const games = await this.repository.findRandom(count);

        return games.map(GameMapper.toResponse);
    }
}
