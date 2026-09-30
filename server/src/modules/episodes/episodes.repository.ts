import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
    Prisma,
    type Episode,
    type EpisodeSeries,
    type EpisodeStatus,
    type EpisodeType,
} from '../../generated/prisma/client.js';
import type { EpisodeSortField } from './dto/list-episodes-query.dto.js';

const NULLABLE_SORT_FIELDS = new Set<EpisodeSortField>(['overallNumber', 'usAirDate']);

const EPISODE_REFERENCE_SELECT = {
    id: true,
    slug: true,
    title: true,
    season: true,
    episodeNumber: true,
    overallNumber: true,
} satisfies Prisma.EpisodeSelect;

export type EpisodeReference = Prisma.EpisodeGetPayload<{
    select: typeof EPISODE_REFERENCE_SELECT;
}>;

export interface EpisodeFilters {
    search?: string;
    series?: EpisodeSeries;
    type?: EpisodeType;
    status?: EpisodeStatus;
    season?: number;
    writer?: string;
    storyboardArtist?: string;
    airedFrom?: Date;
    airedTo?: Date;
    ids?: number[];
}

export interface EpisodeListParams {
    filters: EpisodeFilters;
    sortField: EpisodeSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class EpisodesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(params: EpisodeListParams): Promise<{ items: Episode[]; total: number }> {
        const where = this.buildWhere(params.filters);
        const primaryOrder: Prisma.EpisodeOrderByWithRelationInput = NULLABLE_SORT_FIELDS.has(
            params.sortField
        )
            ? { [params.sortField]: { sort: params.sortDirection, nulls: 'last' } }
            : { [params.sortField]: params.sortDirection };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.episode.findMany({
                where,
                orderBy: [primaryOrder, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.episode.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<Episode | null> {
        return this.prisma.episode.findUnique({ where: { id } });
    }

    findBySlug(slug: string): Promise<Episode | null> {
        return this.prisma.episode.findUnique({ where: { slug } });
    }

    async findRandom(count: number): Promise<Episode[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM episodes ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const episodes = await this.prisma.episode.findMany({ where: { id: { in: ids } } });
        const byId = new Map(episodes.map((episode) => [episode.id, episode]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    findByOverallNumbers(overallNumbers: number[]): Promise<EpisodeReference[]> {
        if (overallNumbers.length === 0) {
            return Promise.resolve([]);
        }

        return this.prisma.episode.findMany({
            where: { overallNumber: { in: overallNumbers } },
            select: EPISODE_REFERENCE_SELECT,
        });
    }

    private buildWhere(filters: EpisodeFilters): Prisma.EpisodeWhereInput {
        const where: Prisma.EpisodeWhereInput = {
            series: filters.series,
            type: filters.type,
            status: filters.status,
            season: filters.season,
        };

        if (filters.ids) {
            where.id = { in: filters.ids };
        }

        if (filters.search) {
            where.title = { contains: filters.search, mode: 'insensitive' };
        }

        if (filters.writer) {
            where.writers = { has: filters.writer };
        }

        if (filters.storyboardArtist) {
            where.storyboardArtists = { has: filters.storyboardArtist };
        }

        if (filters.airedFrom || filters.airedTo) {
            where.usAirDate = { gte: filters.airedFrom, lte: filters.airedTo };
        }

        return where;
    }
}
