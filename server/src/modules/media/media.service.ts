import { Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import type { ListMediaQueryDto, MediaSortField } from './dto/list-media-query.dto.js';
import type { MediaResponseDto } from './dto/media-response.dto.js';
import { mediaTypeCodec } from './media.enums.js';
import { MediaMapper } from './media.mapper.js';
import { MediaRepository } from './media.repository.js';

export interface MediaPage {
    items: MediaResponseDto[];
    total: number;
}

@Injectable()
export class MediaService {
    constructor(private readonly repository: MediaRepository) {}

    async list(query: ListMediaQueryDto): Promise<MediaPage> {
        const sort = parseSort<MediaSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                type: query.type && mediaTypeCodec.toDatabase(query.type),
                firstAppearanceId: query.firstAppearanceId,
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: items.map(MediaMapper.toResponse), total };
    }

    async findById(id: number): Promise<MediaResponseDto> {
        const media = await this.repository.findById(id);

        if (!media) {
            throw new NotFoundException(`Media with id ${id} not found`);
        }

        return MediaMapper.toResponse(media);
    }

    async findBySlug(slug: string): Promise<MediaResponseDto> {
        const media = await this.repository.findBySlug(slug);

        if (!media) {
            throw new NotFoundException(`Media with slug "${slug}" not found`);
        }

        return MediaMapper.toResponse(media);
    }

    async findRandom(count: number): Promise<MediaResponseDto[]> {
        const media = await this.repository.findRandom(count);

        return media.map(MediaMapper.toResponse);
    }
}
