import { buildGame } from '../../../test/fixtures/game.fixture.js';
import { GamePlatform, GameStatus } from '../../generated/prisma/client.js';
import { GameMapper } from './game.mapper.js';

describe('GameMapper', () => {
    it('maps a game to the public response shape', () => {
        const response = GameMapper.toResponse(buildGame());

        expect(response).toMatchObject({
            id: 1,
            platforms: ['web'],
            status: 'discontinued',
            releaseDate: '2012-01-30',
            releaseYear: 2012,
            image: 'https://cdn.example.com/games/school-house-rush.webp',
            url: '/games/1',
        });
        expect(response).not.toHaveProperty('imageUrl');
    });

    it('maps multiple platforms and multi-word values to kebab-case', () => {
        const response = GameMapper.toResponse(
            buildGame({
                platforms: [GamePlatform.MOBILE, GamePlatform.VOICE_ASSISTANT],
                status: GameStatus.AVAILABLE,
            })
        );

        expect(response.platforms).toEqual(['mobile', 'voice-assistant']);
        expect(response.status).toBe('available');
    });

    it('keeps a year-only release with a null date', () => {
        const response = GameMapper.toResponse(buildGame({ releaseDate: null, releaseYear: 2018 }));

        expect(response).toMatchObject({ releaseDate: null, releaseYear: 2018 });
    });
});
