import { buildMedia } from '../../../test/fixtures/media.fixture.js';
import { MediaType } from '../../generated/prisma/client.js';
import { MediaMapper } from './media.mapper.js';

describe('MediaMapper', () => {
    it('maps media to the public response shape with its first appearance', () => {
        const response = MediaMapper.toResponse(buildMedia());

        expect(response).toMatchObject({
            id: 1,
            type: 'movie',
            parodyOf: 'Star Wars',
            firstAppearance: {
                id: 194,
                slug: 'the-line',
                code: 'S05E38',
                url: '/episodes/194',
            },
            image: 'https://cdn.example.com/in-universe-media/stellar-odyssey.webp',
            url: '/media/1',
        });
        expect(response).not.toHaveProperty('imageUrl');
        expect(response).not.toHaveProperty('firstAppearanceId');
    });

    it('maps multi-word types to kebab-case and keeps missing values null', () => {
        const response = MediaMapper.toResponse(
            buildMedia({
                type: MediaType.VIDEO_GAME,
                parodyOf: null,
                firstAppearanceId: null,
                firstAppearance: null,
            })
        );

        expect(response).toMatchObject({
            type: 'video-game',
            parodyOf: null,
            firstAppearance: null,
        });
    });
});
