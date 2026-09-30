import type { ApiSongType } from '../song.enums.js';

export class SongEpisodeReferenceDto {
    id: number;
    slug: string;
    title: string;
    code: string | null;
    url: string;
}

export class SongCharacterReferenceDto {
    id: number;
    slug: string;
    name: string;
    url: string;
}

export class SongResponseDto {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    type: ApiSongType;
    episode: SongEpisodeReferenceDto | null;
    characters: SongCharacterReferenceDto[];
    vocalists: string[];
    genres: string[];
    duration: string | null;
    durationSeconds: number | null;
    musicalKey: string | null;
    image: string | null;
    url: string;
    createdAt: string;
    updatedAt: string;
}
