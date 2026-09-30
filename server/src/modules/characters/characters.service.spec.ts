import { NotFoundException } from '@nestjs/common';
import { CharacterGender } from '../../generated/prisma/client.js';
import { buildCharacter } from '../../../test/fixtures/character.fixture.js';
import type { CharactersRepository } from './characters.repository.js';
import { CharactersService } from './characters.service.js';
import { ListCharactersQueryDto } from './dto/list-characters-query.dto.js';

describe('CharactersService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
    };
    const service = new CharactersService(repository as unknown as CharactersRepository);

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('translates query filters, sorting and pagination for the repository', async () => {
        repository.findMany.mockResolvedValue({ items: [buildCharacter()], total: 1 });
        const query = Object.assign(new ListCharactersQueryDto(), {
            page: 3,
            limit: 10,
            sort: '-name',
            gender: 'male',
            search: 'gum',
        });

        const result = await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: expect.objectContaining({ gender: CharacterGender.MALE, search: 'gum' }),
            sortField: 'name',
            sortDirection: 'desc',
            skip: 20,
            take: 10,
        });
        expect(result.total).toBe(1);
        expect(result.items[0]?.gender).toBe('male');
    });

    it('returns a character by id', async () => {
        repository.findById.mockResolvedValue(buildCharacter());

        await expect(service.findById(1)).resolves.toMatchObject({ id: 1 });
    });

    it('throws NotFoundException for an unknown id', async () => {
        repository.findById.mockResolvedValue(null);

        await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown slug', async () => {
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findBySlug('nobody')).rejects.toThrow(NotFoundException);
    });
});
