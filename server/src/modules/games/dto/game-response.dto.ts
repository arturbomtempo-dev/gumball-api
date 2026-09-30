import type { ApiGamePlatform, ApiGameStatus } from '../game.enums.js';

export class GameResponseDto {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    platforms: ApiGamePlatform[];
    status: ApiGameStatus;
    releaseDate: string | null;
    releaseYear: number | null;
    developers: string[];
    image: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}
