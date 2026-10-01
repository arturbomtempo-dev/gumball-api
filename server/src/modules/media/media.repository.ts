import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Prisma, type MediaType } from '../../generated/prisma/client.js';
import { EPISODE_REFERENCE_SELECT } from '../episodes/episode-reference.js';
import type { MediaSortField } from './dto/list-media-query.dto.js';

const MEDIA_INCLUDE = {
    firstAppearance: { select: EPISODE_REFERENCE_SELECT },
} satisfies Prisma.MediaInclude;

export type MediaWithRelations = Prisma.MediaGetPayload<{ include: typeof MEDIA_INCLUDE }>;

export interface MediaFilters {
    search?: string;
    type?: MediaType;
    firstAppearanceId?: number;
    ids?: number[];
}

export interface MediaListParams {
    filters: MediaFilters;
    sortField: MediaSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class MediaRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(
        params: MediaListParams
    ): Promise<{ items: MediaWithRelations[]; total: number }> {
        const where = this.buildWhere(params.filters);

        const [items, total] = await this.prisma.$transaction([
            this.prisma.media.findMany({
                where,
                include: MEDIA_INCLUDE,
                orderBy: [{ [params.sortField]: params.sortDirection }, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.media.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<MediaWithRelations | null> {
        return this.prisma.media.findUnique({ where: { id }, include: MEDIA_INCLUDE });
    }

    findBySlug(slug: string): Promise<MediaWithRelations | null> {
        return this.prisma.media.findUnique({ where: { slug }, include: MEDIA_INCLUDE });
    }

    async findRandom(count: number): Promise<MediaWithRelations[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM media ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const media = await this.prisma.media.findMany({
            where: { id: { in: ids } },
            include: MEDIA_INCLUDE,
        });
        const byId = new Map(media.map((item) => [item.id, item]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    private buildWhere(filters: MediaFilters): Prisma.MediaWhereInput {
        const where: Prisma.MediaWhereInput = {
            type: filters.type,
            firstAppearanceId: filters.firstAppearanceId,
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
