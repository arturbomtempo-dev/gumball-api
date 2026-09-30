import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
    Prisma,
    type Game,
    type GamePlatform,
    type GameStatus,
} from '../../generated/prisma/client.js';
import type { GameSortField } from './dto/list-games-query.dto.js';

const NULLABLE_SORT_FIELDS = new Set<GameSortField>(['releaseDate']);

export interface GameFilters {
    search?: string;
    platform?: GamePlatform;
    status?: GameStatus;
    developer?: string;
    releaseYear?: number;
    ids?: number[];
}

export interface GameListParams {
    filters: GameFilters;
    sortField: GameSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class GamesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(params: GameListParams): Promise<{ items: Game[]; total: number }> {
        const where = this.buildWhere(params.filters);
        const primaryOrder: Prisma.GameOrderByWithRelationInput = NULLABLE_SORT_FIELDS.has(
            params.sortField
        )
            ? { [params.sortField]: { sort: params.sortDirection, nulls: 'last' } }
            : { [params.sortField]: params.sortDirection };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.game.findMany({
                where,
                orderBy: [primaryOrder, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.game.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<Game | null> {
        return this.prisma.game.findUnique({ where: { id } });
    }

    findBySlug(slug: string): Promise<Game | null> {
        return this.prisma.game.findUnique({ where: { slug } });
    }

    async findRandom(count: number): Promise<Game[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM games ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const games = await this.prisma.game.findMany({ where: { id: { in: ids } } });
        const byId = new Map(games.map((game) => [game.id, game]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    private buildWhere(filters: GameFilters): Prisma.GameWhereInput {
        const where: Prisma.GameWhereInput = {
            status: filters.status,
            releaseYear: filters.releaseYear,
        };

        if (filters.platform) {
            where.platforms = { has: filters.platform };
        }

        if (filters.developer) {
            where.developers = { has: filters.developer };
        }

        if (filters.ids) {
            where.id = { in: filters.ids };
        }

        if (filters.search) {
            where.title = { contains: filters.search, mode: 'insensitive' };
        }

        return where;
    }
}
