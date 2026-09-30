import { toDateOnly } from '../../common/utils/date.js';
import type { Episode } from '../../generated/prisma/client.js';
import type { EpisodeResponseDto } from './dto/episode-response.dto.js';
import { toEpisodeCode, toEpisodeReference } from './episode-reference.js';
import { episodeStatusCodec, episodeTypeCodec, seriesCodec } from './episode.enums.js';
import type { EpisodeReference } from './episodes.repository.js';

export interface EpisodeNeighbors {
    previous: EpisodeReference | null;
    next: EpisodeReference | null;
}

export const EpisodeMapper = {
    toResponse: (
        episode: Episode,
        neighbors: EpisodeNeighbors = { previous: null, next: null }
    ): EpisodeResponseDto => ({
        id: episode.id,
        slug: episode.slug,
        title: episode.title,
        description: episode.description,
        series: seriesCodec.toApi(episode.series),
        type: episodeTypeCodec.toApi(episode.type),
        status: episodeStatusCodec.toApi(episode.status),
        season: episode.season,
        episodeNumber: episode.episodeNumber,
        overallNumber: episode.overallNumber,
        code: toEpisodeCode(episode.season, episode.episodeNumber),
        productionCode: episode.productionCode,
        usAirDate: toDateOnly(episode.usAirDate),
        ukAirDate: toDateOnly(episode.ukAirDate),
        writers: episode.writers,
        storyboardArtists: episode.storyboardArtists,
        previous: toEpisodeReference(neighbors.previous),
        next: toEpisodeReference(neighbors.next),
        image: episode.imageUrl,
        url: `/episodes/${episode.id}`,
        createdAt: episode.createdAt.toISOString(),
        updatedAt: episode.updatedAt.toISOString(),
    }),
};
