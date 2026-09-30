import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
    EpisodeStatus,
    EpisodeType,
    Prisma,
    type EpisodeSeries,
    type Season,
    type SeasonStatus,
} from '../../generated/prisma/client.js';
import type { SeasonSortField } from './dto/list-seasons-query.dto.js';

const NULLABLE_SORT_FIELDS = new Set<SeasonSortField>(['usPremiereDate']);

export interface SeasonFilters {
    search?: string;
    series?: EpisodeSeries;
    status?: SeasonStatus;
    ids?: number[];
}

export interface SeasonListParams {
    filters: SeasonFilters;
    sortField: SeasonSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class SeasonsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(params: SeasonListParams): Promise<{ items: Season[]; total: number }> {
        const where = this.buildWhere(params.filters);
        const primaryOrder: Prisma.SeasonOrderByWithRelationInput = NULLABLE_SORT_FIELDS.has(
            params.sortField
        )
            ? { [params.sortField]: { sort: params.sortDirection, nulls: 'last' } }
            : { [params.sortField]: params.sortDirection };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.season.findMany({
                where,
                orderBy: [primaryOrder, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.season.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<Season | null> {
        return this.prisma.season.findUnique({ where: { id } });
    }

    findBySlug(slug: string): Promise<Season | null> {
        return this.prisma.season.findUnique({ where: { slug } });
    }

    async findRandom(count: number): Promise<Season[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM seasons ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const seasons = await this.prisma.season.findMany({ where: { id: { in: ids } } });
        const byId = new Map(seasons.map((season) => [season.id, season]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    async countReleasedEpisodes(seasonNumbers: number[]): Promise<Map<number, number>> {
        if (seasonNumbers.length === 0) {
            return new Map();
        }

        const groups = await this.prisma.episode.groupBy({
            by: ['season'],
            where: {
                season: { in: seasonNumbers },
                type: EpisodeType.EPISODE,
                status: EpisodeStatus.RELEASED,
            },
            _count: { _all: true },
        });

        return new Map(
            groups.flatMap((group) =>
                group.season === null ? [] : [[group.season, group._count._all]]
            )
        );
    }

    private buildWhere(filters: SeasonFilters): Prisma.SeasonWhereInput {
        const where: Prisma.SeasonWhereInput = {
            series: filters.series,
            status: filters.status,
        };

        if (filters.ids) {
            where.id = { in: filters.ids };
        }

        if (filters.search) {
            where.title = { contains: filters.search, mode: 'insensitive' };
        }

        return where;
    }
}
