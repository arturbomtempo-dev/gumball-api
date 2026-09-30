import type { ApiEpisodeStatus, ApiEpisodeType, ApiSeries } from '../episode.enums.js';

export class EpisodeReferenceDto {
    id: number;
    slug: string;
    title: string;
    code: string | null;
    url: string;
}

export class EpisodeResponseDto {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    series: ApiSeries;
    type: ApiEpisodeType;
    status: ApiEpisodeStatus;
    season: number | null;
    episodeNumber: number | null;
    overallNumber: number | null;
    code: string | null;
    productionCode: string | null;
    usAirDate: string | null;
    ukAirDate: string | null;
    writers: string[];
    storyboardArtists: string[];
    previous: EpisodeReferenceDto | null;
    next: EpisodeReferenceDto | null;
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}
