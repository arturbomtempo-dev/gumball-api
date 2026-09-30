import { NotFoundException } from '@nestjs/common';
import { GamePlatform, GameStatus } from '../../generated/prisma/client.js';
import { buildGame } from '../../../test/fixtures/game.fixture.js';
import { ListGamesQueryDto } from './dto/list-games-query.dto.js';
import type { GamesRepository } from './games.repository.js';
import { GamesService } from './games.service.js';

describe('GamesService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
    };
    const service = new GamesService(repository as unknown as GamesRepository);

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('translates every filter, sorting and pagination for the repository', async () => {
        repository.findMany.mockResolvedValue({ items: [buildGame()], total: 1 });
        const query = Object.assign(new ListGamesQueryDto(), {
            page: 3,
            limit: 10,
            sort: '-releaseDate',
            platform: 'voice-assistant',
            status: 'discontinued',
            developer: 'Purple Tree Games',
            releaseYear: 2016,
        });

        const result = await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: {
                search: undefined,
                platform: GamePlatform.VOICE_ASSISTANT,
                status: GameStatus.DISCONTINUED,
                developer: 'Purple Tree Games',
                releaseYear: 2016,
                ids: undefined,
            },
            sortField: 'releaseDate',
            sortDirection: 'desc',
            skip: 20,
            take: 10,
        });
        expect(result.items[0]?.platforms).toEqual(['web']);
    });

    it('throws NotFoundException for an unknown id or slug', async () => {
        repository.findById.mockResolvedValue(null);
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        await expect(service.findBySlug('no-game')).rejects.toThrow(NotFoundException);
    });
});
