import { createEnumCodec } from '../../common/utils/enum-codec.js';
import { SongType } from '../../generated/prisma/client.js';

export const songTypeCodec = createEnumCodec({
    [SongType.EPISODE]: 'episode',
    [SongType.THEME]: 'theme',
    [SongType.WEB]: 'web',
});

export type ApiSongType = (typeof songTypeCodec.values)[number];
