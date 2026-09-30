import {
    AnimationStyle,
    CharacterGender,
    CharacterRole,
    CharacterStatus,
    type Character,
} from '../../src/generated/prisma/client.js';

export function buildCharacter(overrides: Partial<Character> = {}): Character {
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
        firstAppearance: 'The DVD',
        colors: ['#43c4da'],
        imageUrl: 'https://cdn.example.com/characters/gumball-watterson.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
