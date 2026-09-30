import { LocationType } from '../../src/generated/prisma/client.js';
import type { LocationWithParent } from '../../src/modules/locations/locations.repository.js';

export function buildLocation(overrides: Partial<LocationWithParent> = {}): LocationWithParent {
    return {
        id: 2,
        slug: 'elmore-junior-high',
        name: 'Elmore Junior High',
        description: 'The public junior high school attended by Gumball, Darwin and Anais.',
        type: LocationType.SCHOOL,
        parentId: 1,
        parent: { id: 1, slug: 'elmore', name: 'Elmore' },
        firstAppearanceId: 2,
        firstAppearance: {
            id: 2,
            slug: 'the-responsible',
            title: 'The Responsible',
            season: 1,
            episodeNumber: 2,
        },
        imageUrl: 'https://cdn.example.com/locations/elmore-junior-high.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
