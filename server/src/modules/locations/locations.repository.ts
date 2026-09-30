import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Prisma, type LocationType } from '../../generated/prisma/client.js';
import type { LocationSortField } from './dto/list-locations-query.dto.js';

const LOCATION_INCLUDE = {
    parent: { select: { id: true, slug: true, name: true } },
} satisfies Prisma.LocationInclude;

export type LocationWithParent = Prisma.LocationGetPayload<{ include: typeof LOCATION_INCLUDE }>;

export interface LocationFilters {
    search?: string;
    type?: LocationType;
    parentId?: number;
    ids?: number[];
}

export interface LocationListParams {
    filters: LocationFilters;
    sortField: LocationSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class LocationsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(
        params: LocationListParams
    ): Promise<{ items: LocationWithParent[]; total: number }> {
        const where = this.buildWhere(params.filters);

        const [items, total] = await this.prisma.$transaction([
            this.prisma.location.findMany({
                where,
                include: LOCATION_INCLUDE,
                orderBy: [{ [params.sortField]: params.sortDirection }, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.location.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<LocationWithParent | null> {
        return this.prisma.location.findUnique({ where: { id }, include: LOCATION_INCLUDE });
    }

    findBySlug(slug: string): Promise<LocationWithParent | null> {
        return this.prisma.location.findUnique({ where: { slug }, include: LOCATION_INCLUDE });
    }

    async findRandom(count: number): Promise<LocationWithParent[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM locations ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const locations = await this.prisma.location.findMany({
            where: { id: { in: ids } },
            include: LOCATION_INCLUDE,
        });
        const byId = new Map(locations.map((location) => [location.id, location]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    private buildWhere(filters: LocationFilters): Prisma.LocationWhereInput {
        const where: Prisma.LocationWhereInput = {
            type: filters.type,
            parentId: filters.parentId,
        };

        if (filters.ids) {
            where.id = { in: filters.ids };
        }

        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        return where;
    }
}
