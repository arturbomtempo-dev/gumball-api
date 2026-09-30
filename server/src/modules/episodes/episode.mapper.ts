import { toDateOnly } from '../../common/utils/date.js';
import type { Episode } from '../../generated/prisma/client.js';
import type { EpisodeReferenceDto, EpisodeResponseDto } from './dto/episode-response.dto.js';
import { episodeStatusCodec, episodeTypeCodec, seriesCodec } from './episode.enums.js';
import type { EpisodeReference } from './episodes.repository.js';

export interface EpisodeNeighbors {
    previous: EpisodeReference | null;
    next: EpisodeReference | null;
}

const episodeUrl = (id: number) => `/episodes/${id}`;

const pad = (value: number) => String(value).padStart(2, '0');

function toCode(season: number | null, episodeNumber: number | null): string | null {
    return season !== null && episodeNumber !== null
        ? `S${pad(season)}E${pad(episodeNumber)}`
        : null;
}

function toReference(episode: EpisodeReference | null): EpisodeReferenceDto | null {
    return episode
        ? {
              id: episode.id,
              slug: episode.slug,
              title: episode.title,
              code: toCode(episode.season, episode.episodeNumber),
              url: episodeUrl(episode.id),
          }
        : null;
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
        code: toCode(episode.season, episode.episodeNumber),
        productionCode: episode.productionCode,
        usAirDate: toDateOnly(episode.usAirDate),
        ukAirDate: toDateOnly(episode.ukAirDate),
        writers: episode.writers,
        storyboardArtists: episode.storyboardArtists,
        previous: toReference(neighbors.previous),
        next: toReference(neighbors.next),
        image: episode.imageUrl,
        url: episodeUrl(episode.id),
        createdAt: episode.createdAt.toISOString(),
        updatedAt: episode.updatedAt.toISOString(),
    }),
};
