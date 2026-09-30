import { createEnumCodec } from '../../common/utils/enum-codec.js';
import { SeasonStatus } from '../../generated/prisma/client.js';

export const seasonStatusCodec = createEnumCodec({
    [SeasonStatus.COMPLETED]: 'completed',
    [SeasonStatus.AIRING]: 'airing',
    [SeasonStatus.UPCOMING]: 'upcoming',
});

export type ApiSeasonStatus = (typeof seasonStatusCodec.values)[number];
