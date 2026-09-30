import { createEnumCodec } from '../../common/utils/enum-codec.js';
import { GamePlatform, GameStatus } from '../../generated/prisma/client.js';

export const gamePlatformCodec = createEnumCodec({
    [GamePlatform.WEB]: 'web',
    [GamePlatform.MOBILE]: 'mobile',
    [GamePlatform.ROBLOX]: 'roblox',
    [GamePlatform.VOICE_ASSISTANT]: 'voice-assistant',
});

export const gameStatusCodec = createEnumCodec({
    [GameStatus.AVAILABLE]: 'available',
    [GameStatus.DISCONTINUED]: 'discontinued',
    [GameStatus.UNKNOWN]: 'unknown',
});

export type ApiGamePlatform = (typeof gamePlatformCodec.values)[number];
export type ApiGameStatus = (typeof gameStatusCodec.values)[number];
