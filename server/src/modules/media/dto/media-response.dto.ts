import type { EpisodeReferenceDto } from '../../episodes/dto/episode-response.dto.js';
import type { ApiMediaType } from '../media.enums.js';

export class MediaResponseDto {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    type: ApiMediaType;
    parodyOf: string | null;
    firstAppearance: EpisodeReferenceDto | null;
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}
