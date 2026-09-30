import { GamePlatform, GameStatus, type Game } from '../../src/generated/prisma/client.js';

export function buildGame(overrides: Partial<Game> = {}): Game {
    return {
        id: 1,
        slug: 'school-house-rush',
        title: 'School House Rush',
        description: 'A 2D side-scrolling platformer set in a flooded Elmore Junior High.',
        platforms: [GamePlatform.WEB],
        status: GameStatus.DISCONTINUED,
        releaseDate: new Date('2012-01-30T00:00:00.000Z'),
        releaseYear: 2012,
        developers: [],
        imageUrl: 'https://cdn.example.com/games/school-house-rush.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
