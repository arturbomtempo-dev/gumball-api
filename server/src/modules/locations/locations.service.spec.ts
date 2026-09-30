import { NotFoundException } from '@nestjs/common';
import { buildLocation } from '../../../test/fixtures/location.fixture.js';
import { LocationType } from '../../generated/prisma/client.js';
import { ListLocationsQueryDto } from './dto/list-locations-query.dto.js';
import type { LocationsRepository } from './locations.repository.js';
import { LocationsService } from './locations.service.js';

describe('LocationsService', () => {
    const repository = {
        findMany: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        findRandom: vi.fn(),
    };
    const service = new LocationsService(repository as unknown as LocationsRepository);

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('translates query filters, sorting and pagination for the repository', async () => {
        repository.findMany.mockResolvedValue({ items: [buildLocation()], total: 1 });
        const query = Object.assign(new ListLocationsQueryDto(), {
            page: 2,
            limit: 5,
            sort: 'name',
            type: 'school-facility',
            parentId: 2,
            search: 'room',
        });

        const result = await service.list(query);

        expect(repository.findMany).toHaveBeenCalledWith({
            filters: {
                search: 'room',
                type: LocationType.SCHOOL_FACILITY,
                parentId: 2,
                ids: undefined,
            },
            sortField: 'name',
            sortDirection: 'asc',
            skip: 5,
            take: 5,
        });
        expect(result.total).toBe(1);
        expect(result.items[0]?.type).toBe('school');
    });

    it('returns a location by id', async () => {
        repository.findById.mockResolvedValue(buildLocation());

        await expect(service.findById(2)).resolves.toMatchObject({ id: 2 });
    });

    it('throws NotFoundException for an unknown id', async () => {
        repository.findById.mockResolvedValue(null);

        await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown slug', async () => {
        repository.findBySlug.mockResolvedValue(null);

        await expect(service.findBySlug('nowhere')).rejects.toThrow(NotFoundException);
    });
});
