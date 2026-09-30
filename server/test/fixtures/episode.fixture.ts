import {
    EpisodeSeries,
    EpisodeStatus,
    EpisodeType,
    type Episode,
} from '../../src/generated/prisma/client.js';

export function buildEpisode(overrides: Partial<Episode> = {}): Episode {
    return {
        id: 1,
        slug: 'the-dvd',
        title: 'The DVD',
        description: 'Gumball and Darwin must pay off a late fee at the video store.',
        series: EpisodeSeries.AMAZING_WORLD,
        type: EpisodeType.EPISODE,
        status: EpisodeStatus.RELEASED,
        season: 1,
        episodeNumber: 1,
        overallNumber: 1,
        productionCode: null,
        usAirDate: new Date('2011-05-03T00:00:00.000Z'),
        ukAirDate: new Date('2011-09-05T00:00:00.000Z'),
        writers: ['Ben Bocquelet', 'Jon Foster', 'James Lamont'],
        storyboardArtists: ['Benjamin Marsaud'],
        imageUrl: 'https://cdn.example.com/episodes/the-dvd.webp',
        createdAt: new Date('2026-09-30T00:00:00.000Z'),
        updatedAt: new Date('2026-09-30T00:00:00.000Z'),
        ...overrides,
    };
}
