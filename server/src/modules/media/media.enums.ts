import { createEnumCodec } from '../../common/utils/enum-codec.js';
import { MediaType } from '../../generated/prisma/client.js';

export const mediaTypeCodec = createEnumCodec({
    [MediaType.TV_SHOW]: 'tv-show',
    [MediaType.MOVIE]: 'movie',
    [MediaType.COMIC]: 'comic',
    [MediaType.BOOK]: 'book',
    [MediaType.APP]: 'app',
    [MediaType.VIDEO_GAME]: 'video-game',
    [MediaType.VIDEO]: 'video',
});

export type ApiMediaType = (typeof mediaTypeCodec.values)[number];
