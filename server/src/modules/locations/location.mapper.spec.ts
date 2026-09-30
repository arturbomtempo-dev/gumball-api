import { LocationType } from '../../generated/prisma/client.js';
import { buildLocation } from '../../../test/fixtures/location.fixture.js';
import { LocationMapper } from './location.mapper.js';

describe('LocationMapper', () => {
    it('maps a location to the public response shape with a parent reference', () => {
        const response = LocationMapper.toResponse(buildLocation());

        expect(response).toMatchObject({
            id: 2,
            slug: 'elmore-junior-high',
            type: 'school',
            parent: { id: 1, slug: 'elmore', name: 'Elmore', url: '/locations/1' },
            image: 'https://cdn.example.com/locations/elmore-junior-high.webp',
            url: '/locations/2',
            createdAt: '2026-09-30T00:00:00.000Z',
        });
        expect(response).not.toHaveProperty('imageUrl');
        expect(response).not.toHaveProperty('parentId');
    });

    it('returns a null parent for top-level locations', () => {
        const response = LocationMapper.toResponse(
            buildLocation({ id: 1, parentId: null, parent: null, type: LocationType.TOWN })
        );

        expect(response.parent).toBeNull();
        expect(response.type).toBe('town');
    });

    it('maps multi-word types to kebab-case', () => {
        const response = LocationMapper.toResponse(
            buildLocation({ type: LocationType.SCHOOL_FACILITY })
        );

        expect(response.type).toBe('school-facility');
    });
});
