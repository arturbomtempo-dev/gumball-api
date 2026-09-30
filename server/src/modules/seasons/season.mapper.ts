import { toDateOnly } from '../../common/utils/date.js';
import type { Season } from '../../generated/prisma/client.js';
import { seriesCodec } from '../episodes/episode.enums.js';
import type { SeasonResponseDto } from './dto/season-response.dto.js';
import { seasonStatusCodec } from './season.enums.js';

export const SeasonMapper = {
    toResponse: (season: Season, releasedEpisodeCount = 0): SeasonResponseDto => ({
        id: season.id,
        slug: season.slug,
        number: season.number,
        title: season.title,
        description: season.description,
        series: seriesCodec.toApi(season.series),
        seriesSeasonNumber: season.seriesSeasonNumber,
        status: seasonStatusCodec.toApi(season.status),
        episodeCount: season.episodeCount,
        releasedEpisodeCount,
        networks: season.networks,
        usPremiereDate: toDateOnly(season.usPremiereDate),
        usFinaleDate: toDateOnly(season.usFinaleDate),
        ukPremiereDate: toDateOnly(season.ukPremiereDate),
        ukFinaleDate: toDateOnly(season.ukFinaleDate),
        episodes: `/episodes?season=${season.number}`,
        image: season.imageUrl,
        url: `/seasons/${season.id}`,
        createdAt: season.createdAt.toISOString(),
        updatedAt: season.updatedAt.toISOString(),
    }),
};
