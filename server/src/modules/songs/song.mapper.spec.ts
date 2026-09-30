import { SongType } from '../../generated/prisma/client.js';
import { buildSong } from '../../../test/fixtures/song.fixture.js';
import { SongMapper } from './song.mapper.js';

describe('SongMapper', () => {
    it('maps a song with its episode and characters to the public response shape', () => {
        const response = SongMapper.toResponse(buildSong());

        expect(response).toMatchObject({
            id: 1,
            type: 'episode',
            episode: { id: 4, slug: 'the-debt', code: 'S01E04', url: '/episodes/4' },
            characters: [
                {
                    id: 12,
                    slug: 'gaylord-robinson',
                    name: 'Gaylord Robinson',
                    url: '/characters/12',
                },
            ],
            duration: '2:36',
            durationSeconds: 156,
            musicalKey: 'A minor',
            url: '/songs/1',
        });
        expect(response).not.toHaveProperty('imageUrl');
        expect(response).not.toHaveProperty('episodeId');
    });

    it.each([
        [9, '0:09'],
        [60, '1:00'],
        [605, '10:05'],
    ])('formats %i seconds as %s', (seconds, formatted) => {
        expect(SongMapper.toResponse(buildSong({ durationSeconds: seconds })).duration).toBe(
            formatted
        );
    });

    it('handles songs outside episodes without duration or image', () => {
        const response = SongMapper.toResponse(
            buildSong({
                type: SongType.PROMO,
                episodeId: null,
                episode: null,
                characters: [],
                durationSeconds: null,
                imageUrl: null,
            })
        );

        expect(response).toMatchObject({
            type: 'promo',
            episode: null,
            characters: [],
            duration: null,
            image: null,
        });
    });
});
