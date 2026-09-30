import { NotFoundException } from '@nestjs/common';
import { buildSong } from '../../../test/fixtures/song.fixture.js';
import { SongType } from '../../generated/prisma/client.js';
import { ListSongsQueryDto } from './dto/list-songs-query.dto.js';
import type { SongsRepository } from './songs.repository.js';
import { SongsService } from './songs.service.js';

describe('SongsService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
    };
    const service = new SongsService(repository as unknown as SongsRepository);

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('translates every filter, sorting and pagination for the repository', async () => {
        repository.findMany.mockResolvedValue({ items: [buildSong()], total: 1 });
        const query = Object.assign(new ListSongsQueryDto(), {
            page: 2,
            limit: 5,
            sort: '-durationSeconds',
            type: 'theme',
            episodeId: 4,
            season: 1,
            characterId: 12,
            vocalist: 'Rupert Degas',
            genre: 'Hip-Hop',
        });

        const result = await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: {
                search: undefined,
                type: SongType.THEME,
                episodeId: 4,
                season: 1,
                characterId: 12,
                vocalist: 'Rupert Degas',
                genre: 'Hip-Hop',
                ids: undefined,
            },
            sortField: 'durationSeconds',
            sortDirection: 'desc',
            skip: 5,
            take: 5,
        });
        expect(result.items[0]?.episode?.code).toBe('S01E04');
    });

    it('throws NotFoundException for an unknown id or slug', async () => {
        repository.findById.mockResolvedValue(null);
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        await expect(service.findBySlug('no-song')).rejects.toThrow(NotFoundException);
    });
});
