import {
    AnimationStyle,
    CharacterGender,
    CharacterRole,
    CharacterStatus,
} from '../../src/generated/prisma/client.js';
import type { CharacterWithRelations } from '../../src/modules/characters/characters.repository.js';

export function buildCharacter(
    overrides: Partial<CharacterWithRelations> = {}
): CharacterWithRelations {
    return {
        id: 1,
        slug: 'gumball-watterson',
        name: 'Gumball Watterson',
        fullName: 'Gumball Tristopher Watterson',
        aliases: ['Gummypuss'],
        description: 'A 12-year-old blue cat.',
        species: 'Cat',
        gender: CharacterGender.MALE,
        age: 12,
        occupation: 'Student',
        role: CharacterRole.MAIN,
        status: CharacterStatus.ALIVE,
        animationStyle: AnimationStyle.TWO_D,
        voiceActors: ['Logan Grove'],
        firstAppearanceId: 1,
        firstAppearance: { id: 1, slug: 'the-dvd', title: 'The DVD', season: 1, episodeNumber: 1 },
        colors: ['#43c4da'],
        imageUrl: 'https://cdn.example.com/characters/gumball-watterson.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
