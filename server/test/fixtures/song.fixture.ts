import { SongType } from '../../src/generated/prisma/client.js';
import type { SongWithRelations } from '../../src/modules/songs/songs.repository.js';

export function buildSong(overrides: Partial<SongWithRelations> = {}): SongWithRelations {
    return {
        id: 1,
        slug: 'i-wanna-be-free',
        title: 'I Wanna Be Free',
        description: 'Mr. Robinson\'s rock anthem in "The Debt."',
        type: SongType.EPISODE,
        episodeId: 4,
        episode: { id: 4, slug: 'the-debt', title: 'The Debt', season: 1, episodeNumber: 4 },
        characters: [{ character: { id: 12, slug: 'gaylord-robinson', name: 'Gaylord Robinson' } }],
        vocalists: ['Rupert Degas'],
        genres: ['Dance-Rock', 'Arena Rock', 'Musical'],
        durationSeconds: 156,
        musicalKey: 'A minor',
        imageUrl: 'https://cdn.example.com/songs/i-wanna-be-free.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
