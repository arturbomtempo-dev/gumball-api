import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import { fromDateOnly } from '../../common/utils/date.js';
import type { Episode } from '../../generated/prisma/client.js';
import type { EpisodeResponseDto } from './dto/episode-response.dto.js';
import type { EpisodeSortField, ListEpisodesQueryDto } from './dto/list-episodes-query.dto.js';
import { episodeStatusCodec, episodeTypeCodec, seriesCodec } from './episode.enums.js';
import { EpisodeMapper } from './episode.mapper.js';
import { EpisodesRepository, type EpisodeReference } from './episodes.repository.js';

export interface EpisodePage {
    items: EpisodeResponseDto[];
    total: number;
}

@Injectable()
export class EpisodesService {
    constructor(private readonly repository: EpisodesRepository) {}

    async list(query: ListEpisodesQueryDto): Promise<EpisodePage> {
        if (query.airedFrom && query.airedTo && query.airedFrom > query.airedTo) {
            throw new BadRequestException('airedFrom must not be later than airedTo');
        }

        const sort = parseSort<EpisodeSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                series: query.series && seriesCodec.toDatabase(query.series),
                type: query.type && episodeTypeCodec.toDatabase(query.type),
                status: query.status && episodeStatusCodec.toDatabase(query.status),
                season: query.season,
                writer: query.writer,
                storyboardArtist: query.storyboardArtist,
                airedFrom: query.airedFrom ? fromDateOnly(query.airedFrom) : undefined,
                airedTo: query.airedTo ? fromDateOnly(query.airedTo) : undefined,
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: await this.toResponses(items), total };
    }

    async findById(id: number): Promise<EpisodeResponseDto> {
        const episode = await this.repository.findById(id);

        if (!episode) {
            throw new NotFoundException(`Episode with id ${id} not found`);
        }

        return this.toResponse(episode);
    }

    async findBySlug(slug: string): Promise<EpisodeResponseDto> {
        const episode = await this.repository.findBySlug(slug);

        if (!episode) {
            throw new NotFoundException(`Episode with slug "${slug}" not found`);
        }

        return this.toResponse(episode);
    }

    async findRandom(count: number): Promise<EpisodeResponseDto[]> {
        return this.toResponses(await this.repository.findRandom(count));
    }

    private async toResponse(episode: Episode): Promise<EpisodeResponseDto> {
        const [response] = await this.toResponses([episode]);

        return response as EpisodeResponseDto;
    }

    private async toResponses(episodes: Episode[]): Promise<EpisodeResponseDto[]> {
        const wanted = new Set<number>();

        for (const { overallNumber } of episodes) {
            if (overallNumber !== null) {
                wanted.add(overallNumber - 1);
                wanted.add(overallNumber + 1);
            }
        }

        const neighbors = await this.repository.findByOverallNumbers([...wanted]);
        const byNumber = new Map<number, EpisodeReference>(
            neighbors.flatMap((neighbor) =>
                neighbor.overallNumber === null ? [] : [[neighbor.overallNumber, neighbor]]
            )
        );

        return episodes.map((episode) =>
            EpisodeMapper.toResponse(episode, {
                previous:
                    episode.overallNumber === null
                        ? null
                        : (byNumber.get(episode.overallNumber - 1) ?? null),
                next:
                    episode.overallNumber === null
                        ? null
                        : (byNumber.get(episode.overallNumber + 1) ?? null),
            })
        );
    }
}
