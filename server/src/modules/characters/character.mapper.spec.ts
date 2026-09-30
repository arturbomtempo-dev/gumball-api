import { AnimationStyle, CharacterStatus } from '../../generated/prisma/client.js';
import { buildCharacter } from '../../../test/fixtures/character.fixture.js';
import { CharacterMapper } from './character.mapper.js';

describe('CharacterMapper', () => {
    it('maps a character to the public response shape', () => {
        const response = CharacterMapper.toResponse(buildCharacter());

        expect(response).toMatchObject({
            id: 1,
            slug: 'gumball-watterson',
            gender: 'male',
            role: 'main',
            status: 'alive',
            animationStyle: '2d',
            image: 'https://cdn.example.com/characters/gumball-watterson.webp',
            url: '/characters/1',
            createdAt: '2026-09-30T00:00:00.000Z',
        });
        expect(response).not.toHaveProperty('imageUrl');
    });

    it('maps multi-word enums to kebab-case', () => {
        const response = CharacterMapper.toResponse(
            buildCharacter({
                animationStyle: AnimationStyle.STOP_MOTION,
                status: CharacterStatus.UNDEAD,
            })
        );

        expect(response.animationStyle).toBe('stop-motion');
        expect(response.status).toBe('undead');
    });
});
