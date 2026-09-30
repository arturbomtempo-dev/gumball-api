import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Prisma, type SongType } from '../../generated/prisma/client.js';
import { EPISODE_REFERENCE_SELECT } from '../episodes/episode-reference.js';
import type { SongSortField } from './dto/list-songs-query.dto.js';

const NULLABLE_SORT_FIELDS = new Set<SongSortField>(['durationSeconds']);

const SONG_INCLUDE = {
    episode: { select: EPISODE_REFERENCE_SELECT },
    characters: {
        select: { character: { select: { id: true, slug: true, name: true } } },
        orderBy: { character: { id: 'asc' } },
    },
} satisfies Prisma.SongInclude;

export type SongWithRelations = Prisma.SongGetPayload<{ include: typeof SONG_INCLUDE }>;

export interface SongFilters {
    search?: string;
    type?: SongType;
    episodeId?: number;
    season?: number;
    characterId?: number;
    vocalist?: string;
    genre?: string;
    ids?: number[];
}

export interface SongListParams {
    filters: SongFilters;
    sortField: SongSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class SongsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(params: SongListParams): Promise<{ items: SongWithRelations[]; total: number }> {
        const where = this.buildWhere(params.filters);
        const primaryOrder: Prisma.SongOrderByWithRelationInput = NULLABLE_SORT_FIELDS.has(
            params.sortField
        )
            ? { [params.sortField]: { sort: params.sortDirection, nulls: 'last' } }
            : { [params.sortField]: params.sortDirection };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.song.findMany({
                where,
                include: SONG_INCLUDE,
                orderBy: [primaryOrder, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.song.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<SongWithRelations | null> {
        return this.prisma.song.findUnique({ where: { id }, include: SONG_INCLUDE });
    }

    findBySlug(slug: string): Promise<SongWithRelations | null> {
        return this.prisma.song.findUnique({ where: { slug }, include: SONG_INCLUDE });
    }

    async findRandom(count: number): Promise<SongWithRelations[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM songs ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const songs = await this.prisma.song.findMany({
            where: { id: { in: ids } },
            include: SONG_INCLUDE,
        });
        const byId = new Map(songs.map((song) => [song.id, song]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    private buildWhere(filters: SongFilters): Prisma.SongWhereInput {
        const where: Prisma.SongWhereInput = {
            type: filters.type,
            episodeId: filters.episodeId,
        };

        if (filters.season !== undefined) {
            where.episode = { season: filters.season };
        }

        if (filters.characterId !== undefined) {
            where.characters = { some: { characterId: filters.characterId } };
        }

        if (filters.ids) {
            where.id = { in: filters.ids };
        }

        if (filters.search) {
            where.title = { contains: filters.search, mode: 'insensitive' };
        }

        if (filters.vocalist) {
            where.vocalists = { has: filters.vocalist };
        }

        if (filters.genre) {
            where.genres = { has: filters.genre };
        }

        return where;
    }
}
