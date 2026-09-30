import { NotFoundException } from '@nestjs/common';
import { EpisodeSeries, SeasonStatus } from '../../generated/prisma/client.js';
import { buildSeason } from '../../../test/fixtures/season.fixture.js';
import { ListSeasonsQueryDto } from './dto/list-seasons-query.dto.js';
import type { SeasonsRepository } from './seasons.repository.js';
import { SeasonsService } from './seasons.service.js';

describe('SeasonsService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
        countReleasedEpisodes: vi.fn(),
    };
    const service = new SeasonsService(repository as unknown as SeasonsRepository);

    beforeEach(() => {
        vi.resetAllMocks();
        repository.countReleasedEpisodes.mockResolvedValue(new Map());
    });

    it('translates filters and sorting and defaults to season number order', async () => {
        repository.findMany.mockResolvedValue({ items: [], total: 0 });
        const query = Object.assign(new ListSeasonsQueryDto(), {
            series: 'wonderfully-weird-world',
            status: 'upcoming',
        });

        await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: {
                search: undefined,
                series: EpisodeSeries.WONDERFULLY_WEIRD_WORLD,
                status: SeasonStatus.UPCOMING,
                ids: undefined,
            },
            sortField: 'number',
            sortDirection: 'asc',
            skip: 0,
            take: 20,
        });
    });

    it('counts released episodes for every listed season in a single lookup', async () => {
        repository.findMany.mockResolvedValue({
            items: [buildSeason(), buildSeason({ id: 2, number: 2, slug: 'season-2' })],
            total: 2,
        });
        repository.countReleasedEpisodes.mockResolvedValue(
            new Map([
                [1, 36],
                [2, 40],
            ])
        );

        const { items } = await service.list(new ListSeasonsQueryDto());

        expect(repository.countReleasedEpisodes).toHaveBeenCalledTimes(1);
        expect(repository.countReleasedEpisodes).toHaveBeenCalledWith([1, 2]);
        expect(items.map((season) => season.releasedEpisodeCount)).toEqual([36, 40]);
    });

    it('returns a season by id', async () => {
        repository.findById.mockResolvedValue(buildSeason());

        await expect(service.findById(1)).resolves.toMatchObject({ id: 1, number: 1 });
    });

    it('throws NotFoundException for an unknown id or slug', async () => {
        repository.findById.mockResolvedValue(null);
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findById(99)).rejects.toThrow(NotFoundException);
        await expect(service.findBySlug('season-99')).rejects.toThrow(NotFoundException);
    });
});
