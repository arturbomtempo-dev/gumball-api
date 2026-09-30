import { createEnumCodec } from '../../common/utils/enum-codec.js';
import { EpisodeSeries, EpisodeStatus, EpisodeType } from '../../generated/prisma/client.js';

export const seriesCodec = createEnumCodec({
    [EpisodeSeries.AMAZING_WORLD]: 'amazing-world',
    [EpisodeSeries.WONDERFULLY_WEIRD_WORLD]: 'wonderfully-weird-world',
});

export const episodeTypeCodec = createEnumCodec({
    [EpisodeType.EPISODE]: 'episode',
    [EpisodeType.SPECIAL]: 'special',
    [EpisodeType.SHORT]: 'short',
    [EpisodeType.PILOT]: 'pilot',
    [EpisodeType.FILM]: 'film',
});

export const episodeStatusCodec = createEnumCodec({
    [EpisodeStatus.RELEASED]: 'released',
    [EpisodeStatus.UNRELEASED]: 'unreleased',
    [EpisodeStatus.SCRAPPED]: 'scrapped',
});

export type ApiSeries = (typeof seriesCodec.values)[number];
export type ApiEpisodeType = (typeof episodeTypeCodec.values)[number];
export type ApiEpisodeStatus = (typeof episodeStatusCodec.values)[number];
