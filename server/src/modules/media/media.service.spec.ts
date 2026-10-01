import { NotFoundException } from '@nestjs/common';
import { buildMedia } from '../../../test/fixtures/media.fixture.js';
import { MediaType } from '../../generated/prisma/client.js';
import { ListMediaQueryDto } from './dto/list-media-query.dto.js';
import type { MediaRepository } from './media.repository.js';
import { MediaService } from './media.service.js';

describe('MediaService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
    };
    const service = new MediaService(repository as unknown as MediaRepository);

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('translates filters, sorting and pagination for the repository', async () => {
        repository.findMany.mockResolvedValue({ items: [buildMedia()], total: 1 });
        const query = Object.assign(new ListMediaQueryDto(), {
            page: 2,
            limit: 5,
            sort: '-title',
            type: 'tv-show',
            firstAppearanceId: 8,
            search: 'show',
        });

        const result = await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: {
                search: 'show',
                type: MediaType.TV_SHOW,
                firstAppearanceId: 8,
                ids: undefined,
            },
            sortField: 'title',
            sortDirection: 'desc',
            skip: 5,
            take: 5,
        });
        expect(result.items[0]?.firstAppearance?.code).toBe('S05E38');
    });

    it('throws NotFoundException for an unknown id or slug', async () => {
        repository.findById.mockResolvedValue(null);
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findById(99)).rejects.toThrow(NotFoundException);
        await expect(service.findBySlug('no-show')).rejects.toThrow(NotFoundException);
    });
});
