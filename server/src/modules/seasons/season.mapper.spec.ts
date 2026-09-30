import { EpisodeSeries, SeasonStatus } from '../../generated/prisma/client.js';
import { buildSeason } from '../../../test/fixtures/season.fixture.js';
import { SeasonMapper } from './season.mapper.js';

describe('SeasonMapper', () => {
    it('maps a season to the public response shape', () => {
        const response = SeasonMapper.toResponse(buildSeason(), 36);

        expect(response).toMatchObject({
            id: 1,
            number: 1,
            series: 'amazing-world',
            status: 'completed',
            episodeCount: 36,
            releasedEpisodeCount: 36,
            usPremiereDate: '2011-05-03',
            ukFinaleDate: '2012-04-01',
            episodes: '/episodes?season=1',
            image: 'https://cdn.example.com/seasons/season-1.webp',
            url: '/seasons/1',
        });
        expect(response).not.toHaveProperty('imageUrl');
    });

    it('defaults the released episode count to zero and keeps missing dates null', () => {
        const response = SeasonMapper.toResponse(
            buildSeason({
                id: 8,
                number: 8,
                series: EpisodeSeries.WONDERFULLY_WEIRD_WORLD,
                seriesSeasonNumber: 2,
                status: SeasonStatus.UPCOMING,
                usPremiereDate: null,
                usFinaleDate: null,
                ukPremiereDate: null,
                ukFinaleDate: null,
            })
        );

        expect(response).toMatchObject({
            series: 'wonderfully-weird-world',
            seriesSeasonNumber: 2,
            status: 'upcoming',
            releasedEpisodeCount: 0,
            usPremiereDate: null,
            episodes: '/episodes?season=8',
        });
    });
});
