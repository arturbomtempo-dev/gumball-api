import { EpisodeSeries, SeasonStatus, type Season } from '../../src/generated/prisma/client.js';

export function buildSeason(overrides: Partial<Season> = {}): Season {
    return {
        id: 1,
        slug: 'season-1',
        number: 1,
        title: 'Season 1',
        description: 'The first season of The Amazing World of Gumball.',
        series: EpisodeSeries.AMAZING_WORLD,
        seriesSeasonNumber: 1,
        status: SeasonStatus.COMPLETED,
        episodeCount: 36,
        networks: ['Cartoon Network'],
        usPremiereDate: new Date('2011-05-03T00:00:00.000Z'),
        usFinaleDate: new Date('2012-03-13T00:00:00.000Z'),
        ukPremiereDate: new Date('2011-09-05T00:00:00.000Z'),
        ukFinaleDate: new Date('2012-04-01T00:00:00.000Z'),
        imageUrl: 'https://cdn.example.com/seasons/season-1.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
