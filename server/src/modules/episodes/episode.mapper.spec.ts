import { EpisodeSeries, EpisodeStatus, EpisodeType } from '../../generated/prisma/client.js';
import { buildEpisode } from '../../../test/fixtures/episode.fixture.js';
import { EpisodeMapper } from './episode.mapper.js';

describe('EpisodeMapper', () => {
    it('maps an episode to the public response shape', () => {
        const response = EpisodeMapper.toResponse(buildEpisode());

        expect(response).toMatchObject({
            id: 1,
            series: 'amazing-world',
            type: 'episode',
            status: 'released',
            code: 'S01E01',
            usAirDate: '2011-05-03',
            ukAirDate: '2011-09-05',
            previous: null,
            next: null,
            image: 'https://cdn.example.com/episodes/the-dvd.webp',
            url: '/episodes/1',
        });
        expect(response).not.toHaveProperty('imageUrl');
    });

    it('builds neighbor references with their codes', () => {
        const response = EpisodeMapper.toResponse(buildEpisode({ id: 2, overallNumber: 2 }), {
            previous: {
                id: 1,
                slug: 'the-dvd',
                title: 'The DVD',
                season: 1,
                episodeNumber: 1,
                overallNumber: 1,
            },
            next: null,
        });

        expect(response.previous).toEqual({
            id: 1,
            slug: 'the-dvd',
            title: 'The DVD',
            code: 'S01E01',
            url: '/episodes/1',
        });
    });

    it('leaves the code empty for entries outside a season', () => {
        const response = EpisodeMapper.toResponse(
            buildEpisode({
                type: EpisodeType.SHORT,
                status: EpisodeStatus.UNRELEASED,
                series: EpisodeSeries.WONDERFULLY_WEIRD_WORLD,
                season: null,
                episodeNumber: null,
                overallNumber: null,
                usAirDate: null,
            })
        );

        expect(response).toMatchObject({
            type: 'short',
            status: 'unreleased',
            series: 'wonderfully-weird-world',
            code: null,
            usAirDate: null,
        });
    });

    it('pads double-digit seasons and episodes', () => {
        const response = EpisodeMapper.toResponse(buildEpisode({ season: 7, episodeNumber: 12 }));

        expect(response.code).toBe('S07E12');
    });
});
