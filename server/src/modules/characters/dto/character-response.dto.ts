import type { EpisodeReferenceDto } from '../../episodes/dto/episode-response.dto.js';
import type { ApiAnimationStyle, ApiGender, ApiRole, ApiStatus } from '../character.enums.js';

export class CharacterResponseDto {
    id: number;
    slug: string;
    name: string;
    fullName: string | null;
    aliases: string[];
    description: string | null;
    species: string | null;
    gender: ApiGender;
    age: number | null;
    occupation: string | null;
    role: ApiRole;
    status: ApiStatus;
    animationStyle: ApiAnimationStyle;
    voiceActors: string[];
    firstAppearance: EpisodeReferenceDto | null;
    colors: string[];
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}
