import { MediaType } from '../../src/generated/prisma/client.js';
import type { MediaWithRelations } from '../../src/modules/media/media.repository.js';

export function buildMedia(overrides: Partial<MediaWithRelations> = {}): MediaWithRelations {
    return {
        id: 1,
        slug: 'stellar-odyssey',
        title: 'Stellar Odyssey',
        description: 'A blockbuster space opera film series.',
        type: MediaType.MOVIE,
        parodyOf: 'Star Wars',
        firstAppearanceId: 194,
        firstAppearance: {
            id: 194,
            slug: 'the-line',
            title: 'The Line',
            season: 5,
            episodeNumber: 38,
        },
        imageUrl: 'https://cdn.example.com/in-universe-media/stellar-odyssey.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
