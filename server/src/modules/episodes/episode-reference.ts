import type { Prisma } from '../../generated/prisma/client.js';
import type { EpisodeReferenceDto } from './dto/episode-response.dto.js';

export const EPISODE_REFERENCE_SELECT = {
    id: true,
    slug: true,
    title: true,
    season: true,
    episodeNumber: true,
} satisfies Prisma.EpisodeSelect;

export type EpisodeReferenceRecord = Prisma.EpisodeGetPayload<{
    select: typeof EPISODE_REFERENCE_SELECT;
}>;

const pad = (value: number) => String(value).padStart(2, '0');

export function toEpisodeCode(season: number | null, episodeNumber: number | null): string | null {
    return season !== null && episodeNumber !== null
        ? `S${pad(season)}E${pad(episodeNumber)}`
        : null;
}

export function toEpisodeReference(
    episode: EpisodeReferenceRecord | null
): EpisodeReferenceDto | null {
    return episode
        ? {
              id: episode.id,
              slug: episode.slug,
              title: episode.title,
              code: toEpisodeCode(episode.season, episode.episodeNumber),
              url: `/episodes/${episode.id}`,
          }
        : null;
}
