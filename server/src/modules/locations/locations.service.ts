import { Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import type { ListLocationsQueryDto, LocationSortField } from './dto/list-locations-query.dto.js';
import type { LocationResponseDto } from './dto/location-response.dto.js';
import { locationTypeCodec } from './location.enums.js';
import { LocationMapper } from './location.mapper.js';
import { LocationsRepository } from './locations.repository.js';

export interface LocationPage {
    items: LocationResponseDto[];
    total: number;
}

@Injectable()
export class LocationsService {
    constructor(private readonly repository: LocationsRepository) {}

    async list(query: ListLocationsQueryDto): Promise<LocationPage> {
        const sort = parseSort<LocationSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                type: query.type && locationTypeCodec.toDatabase(query.type),
                parentId: query.parentId,
                firstAppearanceId: query.firstAppearanceId,
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: items.map(LocationMapper.toResponse), total };
    }

    async findById(id: number): Promise<LocationResponseDto> {
        const location = await this.repository.findById(id);

        if (!location) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }

        return LocationMapper.toResponse(location);
    }

    async findBySlug(slug: string): Promise<LocationResponseDto> {
        const location = await this.repository.findBySlug(slug);

        if (!location) {
            throw new NotFoundException(`Location with slug "${slug}" not found`);
        }

        return LocationMapper.toResponse(location);
    }

    async findRandom(count: number): Promise<LocationResponseDto[]> {
        const locations = await this.repository.findRandom(count);

        return locations.map(LocationMapper.toResponse);
    }
}
