import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EpisodeSeries } from '../../generated/prisma/client.js';
import { buildEpisode } from '../../../test/fixtures/episode.fixture.js';
import { ListEpisodesQueryDto } from './dto/list-episodes-query.dto.js';
import type { EpisodesRepository } from './episodes.repository.js';
import { EpisodesService } from './episodes.service.js';

const reference = (id: number, overallNumber: number) => ({
    id,
    slug: `episode-${id}`,
    title: `Episode ${id}`,
    season: 1,
    episodeNumber: overallNumber,
    overallNumber,
});

describe('EpisodesService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
        findByOverallNumbers: vi.fn(),
    };
    const service = new EpisodesService(repository as unknown as EpisodesRepository);

    beforeEach(() => {
        vi.resetAllMocks();
        repository.findByOverallNumbers.mockResolvedValue([]);
    });

    it('translates filters, dates, sorting and pagination for the repository', async () => {
        repository.findMany.mockResolvedValue({ items: [], total: 0 });
        const query = Object.assign(new ListEpisodesQueryDto(), {
            page: 2,
            limit: 10,
            sort: '-usAirDate',
            series: 'wonderfully-weird-world',
            season: 7,
            airedFrom: '2025-01-01',
            airedTo: '2025-12-31',
        });

        await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: expect.objectContaining({
                series: EpisodeSeries.WONDERFULLY_WEIRD_WORLD,
                season: 7,
                airedFrom: new Date('2025-01-01T00:00:00.000Z'),
                airedTo: new Date('2025-12-31T00:00:00.000Z'),
            }),
            sortField: 'usAirDate',
            sortDirection: 'desc',
            skip: 10,
            take: 10,
        });
    });

    it('rejects a date range where airedFrom is after airedTo', async () => {
        const query = Object.assign(new ListEpisodesQueryDto(), {
            airedFrom: '2020-01-01',
            airedTo: '2019-01-01',
        });

        await expect(service.list(query)).rejects.toThrow(BadRequestException);
        expect(repository.findMany).not.toHaveBeenCalled();
    });

    it('resolves previous and next episodes with a single lookup', async () => {
        repository.findMany.mockResolvedValue({
            items: [
                buildEpisode({ id: 10, overallNumber: 10 }),
                buildEpisode({ id: 11, overallNumber: 11 }),
            ],
            total: 2,
        });
        repository.findByOverallNumbers.mockResolvedValue([
            reference(9, 9),
            reference(10, 10),
            reference(11, 11),
            reference(12, 12),
        ]);

        const { items } = await service.list(new ListEpisodesQueryDto());

        expect(repository.findByOverallNumbers).toHaveBeenCalledTimes(1);
        expect(repository.findByOverallNumbers.mock.calls[0]?.[0]).toEqual(
            expect.arrayContaining([9, 10, 11, 12])
        );
        expect(items[0]?.previous?.id).toBe(9);
        expect(items[0]?.next?.id).toBe(11);
        expect(items[1]?.previous?.id).toBe(10);
        expect(items[1]?.next?.id).toBe(12);
    });

    it('does not look up neighbors for entries without an overall number', async () => {
        repository.findById.mockResolvedValue(buildEpisode({ overallNumber: null }));

        const response = await service.findById(1);

        expect(repository.findByOverallNumbers).toHaveBeenCalledWith([]);
        expect(response.previous).toBeNull();
        expect(response.next).toBeNull();
    });

    it('throws NotFoundException for an unknown id or slug', async () => {
        repository.findById.mockResolvedValue(null);
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        await expect(service.findBySlug('the-nothing')).rejects.toThrow(NotFoundException);
    });
});
