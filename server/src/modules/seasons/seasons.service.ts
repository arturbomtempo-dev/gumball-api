import { Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import type { Season } from '../../generated/prisma/client.js';
import { seriesCodec } from '../episodes/episode.enums.js';
import type { ListSeasonsQueryDto, SeasonSortField } from './dto/list-seasons-query.dto.js';
import type { SeasonResponseDto } from './dto/season-response.dto.js';
import { seasonStatusCodec } from './season.enums.js';
import { SeasonMapper } from './season.mapper.js';
import { SeasonsRepository } from './seasons.repository.js';

export interface SeasonPage {
    items: SeasonResponseDto[];
    total: number;
}

@Injectable()
export class SeasonsService {
    constructor(private readonly repository: SeasonsRepository) {}

    async list(query: ListSeasonsQueryDto): Promise<SeasonPage> {
        const sort = parseSort<SeasonSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                series: query.series && seriesCodec.toDatabase(query.series),
                status: query.status && seasonStatusCodec.toDatabase(query.status),
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: await this.toResponses(items), total };
    }

    async findById(id: number): Promise<SeasonResponseDto> {
        const season = await this.repository.findById(id);

        if (!season) {
            throw new NotFoundException(`Season with id ${id} not found`);
        }

        return this.toResponse(season);
    }

    async findBySlug(slug: string): Promise<SeasonResponseDto> {
        const season = await this.repository.findBySlug(slug);

        if (!season) {
            throw new NotFoundException(`Season with slug "${slug}" not found`);
        }

        return this.toResponse(season);
    }

    async findRandom(count: number): Promise<SeasonResponseDto[]> {
        return this.toResponses(await this.repository.findRandom(count));
    }

    private async toResponse(season: Season): Promise<SeasonResponseDto> {
        const [response] = await this.toResponses([season]);

        return response as SeasonResponseDto;
    }

    private async toResponses(seasons: Season[]): Promise<SeasonResponseDto[]> {
        const counts = await this.repository.countReleasedEpisodes(
            seasons.map((season) => season.number)
        );

        return seasons.map((season) => SeasonMapper.toResponse(season, counts.get(season.number)));
    }
}
