import type { ApiSeries } from '../../episodes/episode.enums.js';
import type { ApiSeasonStatus } from '../season.enums.js';

export class SeasonResponseDto {
    id: number;
    slug: string;
    number: number;
    title: string;
    description: string | null;
    series: ApiSeries;
    seriesSeasonNumber: number;
    status: ApiSeasonStatus;
    episodeCount: number | null;
    releasedEpisodeCount: number;
    networks: string[];
    usPremiereDate: string | null;
    usFinaleDate: string | null;
    ukPremiereDate: string | null;
    ukFinaleDate: string | null;
    episodes: string;
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}
