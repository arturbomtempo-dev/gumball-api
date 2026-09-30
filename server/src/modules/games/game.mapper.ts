import { toDateOnly } from '../../common/utils/date.js';
import type { Game } from '../../generated/prisma/client.js';
import type { GameResponseDto } from './dto/game-response.dto.js';
import { gamePlatformCodec, gameStatusCodec } from './game.enums.js';

export const GameMapper = {
    toResponse: (game: Game): GameResponseDto => ({
        id: game.id,
        slug: game.slug,
        title: game.title,
        description: game.description,
        platforms: game.platforms.map((platform) => gamePlatformCodec.toApi(platform)),
        status: gameStatusCodec.toApi(game.status),
        releaseDate: toDateOnly(game.releaseDate),
        releaseYear: game.releaseYear,
        developers: game.developers,
        image: game.imageUrl,
        url: `/games/${game.id}`,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString(),
    }),
};
