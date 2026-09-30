import type { ApiLocationType } from '../location.enums.js';

export class LocationReferenceDto {
    id: number;
    slug: string;
    name: string;
    url: string;
}

export class LocationResponseDto {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    type: ApiLocationType;
    parent: LocationReferenceDto | null;
    firstAppearance: string | null;
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}
